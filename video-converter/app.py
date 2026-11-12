#!/usr/bin/env python3
"""Convertidor de Video a WebM / WebP — interfaz gráfica de escritorio.

Ejecutar:  python app.py
"""
from __future__ import annotations

import os
import queue
import subprocess
import sys
import threading
import time
import tkinter as tk
from pathlib import Path
from tkinter import filedialog, messagebox, ttk

from converter_core import (VIDEO_EXT, Cancelled, ConversionError, Options,
                            convert, find_ffmpeg, output_path, probe_duration)

try:  # Arrastrar y soltar (opcional: pip install tkinterdnd2)
    from tkinterdnd2 import DND_FILES, TkinterDnD
    BaseTk = TkinterDnD.Tk
    HAS_DND = True
except Exception:
    BaseTk = tk.Tk
    HAS_DND = False

APP_NAME = "Convertidor de Video"
RESOLUCIONES = {"Original": None, "1920 px (Full HD)": 1920, "1280 px (HD)": 1280,
                "854 px (480p)": 854, "640 px": 640, "480 px": 480, "320 px": 320}
FPS_OPCIONES = {"Original": None, "60": 60, "30": 30, "24": 24, "15": 15, "10": 10}

IS_MAC = sys.platform == "darwin"
# Fuente nativa de cada sistema; en Mac los puntos se ven más pequeños, se agranda un poco.
FONT = "Segoe UI" if os.name == "nt" else ("Helvetica Neue" if IS_MAC else "DejaVu Sans")
FONT_EXTRA = 3 if IS_MAC else 0


def font(size: int, *style: str) -> tuple:
    return (FONT, size + FONT_EXTRA, *style)


COLOR_BG = "#f4f6fb"
COLOR_ACCENT = "#3b5bdb"
COLOR_OK = "#2b8a3e"
COLOR_ERR = "#c92a2a"
COLOR_WORK = "#1864ab"


def human_size(n: float) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024:
            return f"{n:.0f} {unit}" if unit == "B" else f"{n:.1f} {unit}"
        n /= 1024
    return f"{n:.1f} TB"


def human_time(s: float | None) -> str:
    if s is None:
        return "—"
    s = int(round(s))
    h, rem = divmod(s, 3600)
    m, s = divmod(rem, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def open_path(path: Path) -> None:
    try:
        if os.name == "nt":
            os.startfile(str(path))  # type: ignore[attr-defined]
        elif sys.platform == "darwin":
            subprocess.Popen(["open", str(path)])
        else:
            subprocess.Popen(["xdg-open", str(path)])
    except Exception as e:
        messagebox.showerror(APP_NAME, f"No se pudo abrir:\n{path}\n\n{e}")


class App(BaseTk):
    def __init__(self) -> None:
        super().__init__()
        self.title(APP_NAME)
        self.geometry("1000x760")
        self.minsize(860, 680)
        self.configure(bg=COLOR_BG)

        self.ffmpeg = find_ffmpeg()
        self.items: dict[str, dict] = {}      # iid → {src, dur, status, dst}
        self.events: queue.Queue = queue.Queue()
        self.cancel_event = threading.Event()
        self.worker: threading.Thread | None = None
        self.last_out_dir: Path | None = None

        self._setup_style()
        self._build_ui()
        self.protocol("WM_DELETE_WINDOW", self._on_close)
        self.after(100, self._poll_events)

        if not self.ffmpeg:
            self.after(300, lambda: messagebox.showwarning(
                APP_NAME,
                "No se encontró ffmpeg.\n\n" + (
                    "Instálalo abriendo la app Terminal y escribiendo:\n\n"
                    "    brew install ffmpeg\n\n"
                    "(si no tienes Homebrew, instálalo antes desde https://brew.sh)"
                    if IS_MAC else
                    "Instálalo (por ejemplo en Windows: 'winget install ffmpeg') o coloca "
                    "ffmpeg.exe en la misma carpeta que este programa.")
                + "\n\nLuego vuelve a abrir el programa."))

    # ------------------------------------------------------------------ UI
    def _setup_style(self) -> None:
        st = ttk.Style(self)
        if "vista" in st.theme_names():
            st.theme_use("vista")
        elif IS_MAC and "aqua" in st.theme_names():
            st.theme_use("aqua")
        elif "clam" in st.theme_names():
            st.theme_use("clam")
        st.configure(".", font=font(10))
        st.configure("TFrame", background=COLOR_BG)
        st.configure("TLabel", background=COLOR_BG)
        st.configure("TLabelframe", background=COLOR_BG)
        st.configure("TLabelframe.Label", background=COLOR_BG, font=font(10, "bold"))
        st.configure("TRadiobutton", background=COLOR_BG)
        st.configure("TCheckbutton", background=COLOR_BG)
        st.configure("Title.TLabel", font=font(18, "bold"), foreground="#1c2541")
        st.configure("Sub.TLabel", foreground="#5c677d")
        st.configure("Status.TLabel", foreground="#495057")
        st.configure("Accent.TButton", font=font(11, "bold"), padding=(18, 8))
        st.configure("Treeview", rowheight=28)
        st.configure("Treeview.Heading", font=font(10, "bold"))
        st.configure("green.Horizontal.TProgressbar", troughcolor="#e9ecef")

    def _build_ui(self) -> None:
        root = ttk.Frame(self, padding=16)
        root.pack(fill="both", expand=True)

        # Encabezado
        head = ttk.Frame(root)
        head.pack(fill="x")
        ttk.Label(head, text="🎬  " + APP_NAME, style="Title.TLabel").pack(side="left")
        ttk.Label(head, text="Convierte cualquier video a WebM o WebP animado",
                  style="Sub.TLabel").pack(side="left", padx=14, pady=(8, 0))

        # Barra de botones
        bar = ttk.Frame(root)
        bar.pack(fill="x", pady=(14, 6))
        self.btn_add = ttk.Button(bar, text="➕ Agregar videos", command=self.add_files)
        self.btn_add.pack(side="left")
        self.btn_folder = ttk.Button(bar, text="📁 Agregar carpeta", command=self.add_folder)
        self.btn_folder.pack(side="left", padx=6)
        self.btn_remove = ttk.Button(bar, text="✖ Quitar seleccionados", command=self.remove_selected)
        self.btn_remove.pack(side="left")
        self.btn_clear = ttk.Button(bar, text="🗑 Limpiar lista", command=self.clear_list)
        self.btn_clear.pack(side="left", padx=6)
        hint = "Arrastra videos a la lista" if HAS_DND else "Doble clic en un video convertido para abrirlo"
        ttk.Label(bar, text=hint, style="Sub.TLabel").pack(side="right")

        # Lista de videos
        lst = ttk.Frame(root)
        lst.pack(fill="both", expand=True)
        cols = ("archivo", "tamano", "duracion", "estado", "progreso")
        self.tree = ttk.Treeview(lst, columns=cols, show="headings", selectmode="extended")
        for c, text, w, anchor in (("archivo", "Archivo", 340, "w"),
                                   ("tamano", "Tamaño", 90, "e"),
                                   ("duracion", "Duración", 80, "center"),
                                   ("estado", "Estado", 240, "w"),
                                   ("progreso", "Progreso", 80, "center")):
            self.tree.heading(c, text=text)
            self.tree.column(c, width=w, anchor=anchor, stretch=(c in ("archivo", "estado")))
        self.tree.tag_configure("done", foreground=COLOR_OK)
        self.tree.tag_configure("error", foreground=COLOR_ERR)
        self.tree.tag_configure("working", foreground=COLOR_WORK)
        sb = ttk.Scrollbar(lst, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=sb.set)
        self.tree.pack(side="left", fill="both", expand=True)
        sb.pack(side="right", fill="y")
        self.tree.bind("<Double-1>", self._on_double_click)
        self.tree.bind("<Delete>", lambda e: self.remove_selected())
        if HAS_DND:
            self.tree.drop_target_register(DND_FILES)
            self.tree.dnd_bind("<<Drop>>", self._on_drop)

        self.empty_label = ttk.Label(
            self.tree, text="Aún no hay videos.\nPulsa «Agregar videos» para empezar.",
            justify="center", foreground="#adb5bd", background="white",
            font=font(12))
        self.empty_label.place(relx=0.5, rely=0.5, anchor="center")

        # Opciones
        opts = ttk.LabelFrame(root, text=" Opciones de conversión ", padding=12)
        opts.pack(fill="x", pady=(12, 0))
        opts.columnconfigure(1, weight=1)

        self.var_fmt = tk.StringVar(value="webm")
        ttk.Label(opts, text="Formato:").grid(row=0, column=0, sticky="w")
        ff = ttk.Frame(opts)
        ff.grid(row=0, column=1, columnspan=3, sticky="w", padx=(6, 20))
        ttk.Radiobutton(ff, text="WebM (video con audio)", value="webm",
                        variable=self.var_fmt, command=self._on_fmt_change).pack(side="left")
        ttk.Radiobutton(ff, text="WebP (animado, sin audio)", value="webp",
                        variable=self.var_fmt, command=self._on_fmt_change).pack(side="left", padx=10)

        ttk.Label(opts, text="Calidad:").grid(row=1, column=0, sticky="w", pady=(10, 0))
        qf = ttk.Frame(opts)
        qf.grid(row=1, column=1, sticky="we", padx=(6, 20), pady=(10, 0))
        self.var_quality = tk.IntVar(value=70)
        self.lbl_quality = ttk.Label(qf, text="70", width=4)
        ttk.Scale(qf, from_=10, to=100, variable=self.var_quality,
                  command=lambda v: self.lbl_quality.configure(text=str(int(float(v))))
                  ).pack(side="left", fill="x", expand=True)
        self.lbl_quality.pack(side="left", padx=(6, 0))

        ttk.Label(opts, text="Resolución:").grid(row=1, column=2, sticky="w", pady=(10, 0))
        self.var_res = tk.StringVar(value="Original")
        ttk.Combobox(opts, textvariable=self.var_res, values=list(RESOLUCIONES),
                     state="readonly", width=18).grid(row=1, column=3, sticky="w", padx=6, pady=(10, 0))

        ttk.Label(opts, text="FPS:").grid(row=2, column=0, sticky="w", pady=(10, 0))
        fpsf = ttk.Frame(opts)
        fpsf.grid(row=2, column=1, columnspan=3, sticky="w", padx=(6, 20), pady=(10, 0))
        self.var_fps = tk.StringVar(value="Original")
        ttk.Combobox(fpsf, textvariable=self.var_fps, values=list(FPS_OPCIONES),
                     state="readonly", width=10).pack(side="left")
        self.var_noaudio = tk.BooleanVar(value=False)
        self.chk_audio = ttk.Checkbutton(fpsf, text="Quitar audio", variable=self.var_noaudio)
        self.chk_audio.pack(side="left", padx=14)

        ttk.Label(opts, text="Guardar en:").grid(row=3, column=0, sticky="w", pady=(10, 0))
        of = ttk.Frame(opts)
        of.grid(row=3, column=1, columnspan=3, sticky="we", padx=6, pady=(10, 0))
        self.var_out_mode = tk.StringVar(value="same")
        ttk.Radiobutton(of, text="Misma carpeta del video", value="same",
                        variable=self.var_out_mode, command=self._on_out_mode).pack(side="left")
        ttk.Radiobutton(of, text="Otra:", value="custom",
                        variable=self.var_out_mode, command=self._on_out_mode).pack(side="left", padx=(10, 4))
        self.var_out_dir = tk.StringVar(value=str(Path.home() / "Videos" / "Convertidos"))
        self.ent_out = ttk.Entry(of, textvariable=self.var_out_dir, state="disabled")
        self.ent_out.pack(side="left", fill="x", expand=True)
        self.btn_out = ttk.Button(of, text="Elegir…", command=self.choose_out_dir, state="disabled")
        self.btn_out.pack(side="left", padx=(4, 0))

        # Progreso
        prog = ttk.Frame(root)
        prog.pack(fill="x", pady=(14, 0))
        prog.columnconfigure(1, weight=1)
        ttk.Label(prog, text="Archivo actual:").grid(row=0, column=0, sticky="w")
        self.pb_file = ttk.Progressbar(prog, maximum=100)
        self.pb_file.grid(row=0, column=1, sticky="we", padx=10)
        self.lbl_file_pct = ttk.Label(prog, text="0 %", width=7, anchor="e")
        self.lbl_file_pct.grid(row=0, column=2)
        ttk.Label(prog, text="Total:").grid(row=1, column=0, sticky="w", pady=(6, 0))
        self.pb_total = ttk.Progressbar(prog, maximum=100)
        self.pb_total.grid(row=1, column=1, sticky="we", padx=10, pady=(6, 0))
        self.lbl_total_pct = ttk.Label(prog, text="0 %", width=7, anchor="e")
        self.lbl_total_pct.grid(row=1, column=2, pady=(6, 0))

        # Pie
        foot = ttk.Frame(root)
        foot.pack(fill="x", pady=(14, 0))
        self.lbl_status = ttk.Label(foot, text="Listo para empezar.", style="Status.TLabel")
        self.lbl_status.pack(side="left")
        self.btn_convert = ttk.Button(foot, text="▶  Convertir", style="Accent.TButton",
                                      command=self.start)
        self.btn_convert.pack(side="right")
        self.btn_cancel = ttk.Button(foot, text="■ Cancelar", command=self.cancel, state="disabled")
        self.btn_cancel.pack(side="right", padx=8)
        self.btn_open = ttk.Button(foot, text="📂 Abrir carpeta de salida",
                                   command=self.open_out_dir, state="disabled")
        self.btn_open.pack(side="right")

    # ------------------------------------------------------- lista de archivos
    def add_files(self) -> None:
        exts = " ".join(f"*{e}" for e in sorted(VIDEO_EXT))
        paths = filedialog.askopenfilenames(
            title="Selecciona videos",
            filetypes=[("Videos", exts), ("Todos los archivos", "*.*")])
        self._add_paths(Path(p) for p in paths)

    def add_folder(self) -> None:
        d = filedialog.askdirectory(title="Selecciona una carpeta con videos")
        if d:
            found = sorted(p for p in Path(d).rglob("*")
                           if p.is_file() and p.suffix.lower() in VIDEO_EXT)
            if not found:
                messagebox.showinfo(APP_NAME, "No se encontraron videos en esa carpeta.")
            self._add_paths(found)

    def _on_drop(self, event) -> None:
        paths = []
        for p in self.tk.splitlist(event.data):
            p = Path(p)
            if p.is_dir():
                paths += [f for f in p.rglob("*") if f.is_file() and f.suffix.lower() in VIDEO_EXT]
            else:
                paths.append(p)
        self._add_paths(paths)

    def _add_paths(self, paths) -> None:
        existing = {it["src"].resolve() for it in self.items.values()}
        added = []
        for p in paths:
            if not p.is_file() or p.resolve() in existing:
                continue
            existing.add(p.resolve())
            try:
                size = human_size(p.stat().st_size)
            except OSError:
                size = "?"
            iid = self.tree.insert("", "end", values=(p.name, size, "…", "En espera", ""))
            self.items[iid] = {"src": p, "dur": None, "status": "pending", "dst": None}
            added.append((iid, p))
        self._refresh_empty()
        if added and self.ffmpeg:
            threading.Thread(target=self._probe_worker, args=(added,), daemon=True).start()
        if added:
            self._set_status(f"{len(self.items)} video(s) en la lista.")

    def _probe_worker(self, added) -> None:
        for iid, p in added:
            try:
                self.events.put(("meta", iid, probe_duration(self.ffmpeg, p)))
            except Exception:
                self.events.put(("meta", iid, None))

    def remove_selected(self) -> None:
        if self._busy():
            return
        for iid in self.tree.selection():
            self.tree.delete(iid)
            self.items.pop(iid, None)
        self._refresh_empty()

    def clear_list(self) -> None:
        if self._busy():
            return
        self.tree.delete(*self.tree.get_children())
        self.items.clear()
        self._refresh_empty()
        self._reset_bars()
        self._set_status("Lista vacía.")

    def _refresh_empty(self) -> None:
        if self.items:
            self.empty_label.place_forget()
        else:
            self.empty_label.place(relx=0.5, rely=0.5, anchor="center")

    def _on_double_click(self, event) -> None:
        iid = self.tree.identify_row(event.y)
        it = self.items.get(iid)
        if it and it["dst"] and Path(it["dst"]).exists():
            open_path(Path(it["dst"]))

    # ------------------------------------------------------------- opciones
    def _on_fmt_change(self) -> None:
        self.chk_audio.configure(state="disabled" if self.var_fmt.get() == "webp" else "normal")

    def _on_out_mode(self) -> None:
        st = "normal" if self.var_out_mode.get() == "custom" else "disabled"
        self.ent_out.configure(state=st)
        self.btn_out.configure(state=st)

    def choose_out_dir(self) -> None:
        d = filedialog.askdirectory(title="Carpeta de salida")
        if d:
            self.var_out_dir.set(d)

    def _conversion_options(self) -> Options:
        return Options(fmt=self.var_fmt.get(), quality=int(self.var_quality.get()),
                       width=RESOLUCIONES.get(self.var_res.get()),
                       fps=FPS_OPCIONES.get(self.var_fps.get()),
                       no_audio=self.var_noaudio.get())

    # ----------------------------------------------------------- conversión
    def _busy(self) -> bool:
        return self.worker is not None and self.worker.is_alive()

    def start(self) -> None:
        if self._busy():
            return
        if not self.ffmpeg:
            self.ffmpeg = find_ffmpeg()
            if not self.ffmpeg:
                messagebox.showerror(APP_NAME, "No se encontró ffmpeg. Instálalo y vuelve a intentarlo.")
                return
        pending = [iid for iid, it in self.items.items() if it["status"] != "done"]
        if not pending:
            messagebox.showinfo(APP_NAME, "Agrega videos a la lista para convertirlos."
                                if not self.items else "Todos los videos ya están convertidos.")
            return
        out_dir = None
        if self.var_out_mode.get() == "custom":
            out_dir = Path(self.var_out_dir.get().strip())
            try:
                out_dir.mkdir(parents=True, exist_ok=True)
            except OSError as e:
                messagebox.showerror(APP_NAME, f"No se puede usar la carpeta de salida:\n{e}")
                return
        opts = self._conversion_options()
        for iid in pending:
            self.items[iid]["status"] = "pending"
            self._set_row(iid, "En espera", "", ())
        self.cancel_event.clear()
        self._set_running(True)
        self._reset_bars()
        self.worker = threading.Thread(target=self._convert_worker,
                                       args=(pending, opts, out_dir), daemon=True)
        self.worker.start()

    def cancel(self) -> None:
        if self._busy():
            self.cancel_event.set()
            self._set_status("Cancelando…")
            self.btn_cancel.configure(state="disabled")

    def _convert_worker(self, iids, opts: Options, out_dir: Path | None) -> None:
        n = len(iids)
        ok = fail = 0
        t0 = time.time()
        for idx, iid in enumerate(iids):
            if self.cancel_event.is_set():
                break
            it = self.items.get(iid)
            if not it:
                continue
            src = it["src"]
            dst = output_path(src, out_dir, opts.fmt)
            self.events.put(("start", iid, idx, n, dst))
            t_file = time.time()

            def prog(frac, iid=iid, idx=idx):
                self.events.put(("progress", iid, frac, (idx + frac) / n))

            try:
                convert(src, dst, opts, on_progress=prog, cancel=self.cancel_event,
                        ffmpeg=self.ffmpeg)
                ok += 1
                self.events.put(("done", iid, dst, time.time() - t_file, (idx + 1) / n))
            except Cancelled:
                self.events.put(("cancelled", iid))
                break
            except (ConversionError, OSError) as e:
                fail += 1
                self.events.put(("error", iid, str(e), (idx + 1) / n))
        self.events.put(("finished", ok, fail, n, self.cancel_event.is_set(),
                         time.time() - t0, out_dir))

    def _poll_events(self) -> None:
        try:
            while True:
                self._handle(self.events.get_nowait())
        except queue.Empty:
            pass
        self.after(100, self._poll_events)

    def _handle(self, ev) -> None:
        kind = ev[0]
        if kind == "meta":
            _, iid, dur = ev
            if iid in self.items:
                self.items[iid]["dur"] = dur
                self.tree.set(iid, "duracion", human_time(dur))
        elif kind == "start":
            _, iid, idx, n, dst = ev
            self.items[iid]["status"] = "working"
            self._set_row(iid, f"Convirtiendo → {dst.name}", "0 %", ("working",))
            self.tree.see(iid)
            self.pb_file["value"] = 0
            self.lbl_file_pct.configure(text="0 %")
            self._set_status(f"Convirtiendo {idx + 1} de {n}: {self.items[iid]['src'].name}")
        elif kind == "progress":
            _, iid, frac, total = ev
            self.pb_file["value"] = frac * 100
            self.lbl_file_pct.configure(text=f"{frac:.0%}")
            self.tree.set(iid, "progreso", f"{frac:.0%}")
            self._set_total(total)
        elif kind == "done":
            _, iid, dst, secs, total = ev
            it = self.items[iid]
            it.update(status="done", dst=dst)
            try:
                size = human_size(Path(dst).stat().st_size)
            except OSError:
                size = "?"
            self._set_row(iid, f"✔ Listo — {Path(dst).name} ({size}, {human_time(secs)})",
                          "100 %", ("done",))
            self.pb_file["value"] = 100
            self.lbl_file_pct.configure(text="100 %")
            self._set_total(total)
            self.last_out_dir = Path(dst).parent
            self.btn_open.configure(state="normal")
        elif kind == "error":
            _, iid, msg, total = ev
            self.items[iid]["status"] = "error"
            self._set_row(iid, f"✖ Error: {msg}", "", ("error",))
            self._set_total(total)
        elif kind == "cancelled":
            _, iid = ev
            self.items[iid]["status"] = "pending"
            self._set_row(iid, "Cancelado", "", ())
        elif kind == "finished":
            _, ok, fail, n, cancelled, secs, out_dir = ev
            self._set_running(False)
            if cancelled:
                self._set_status(f"Cancelado. {ok} de {n} convertido(s).")
                return
            self._set_total(1.0)
            self._set_status(f"Completado: {ok} de {n} convertido(s) en {human_time(secs)}"
                             + (f", {fail} con error." if fail else "."))
            self.bell()
            msg = f"¡Conversión completada!\n\n✔ {ok} video(s) convertido(s)"
            if fail:
                msg += f"\n✖ {fail} con error (revisa la lista)"
            msg += f"\n⏱ Tiempo total: {human_time(secs)}"
            if ok and messagebox.askyesno(APP_NAME, msg + "\n\n¿Abrir la carpeta de salida?"):
                self.open_out_dir()
            elif not ok:
                messagebox.showwarning(APP_NAME, msg)

    # ---------------------------------------------------------- utilidades UI
    def _set_row(self, iid, estado, progreso, tags) -> None:
        if self.tree.exists(iid):
            self.tree.set(iid, "estado", estado)
            self.tree.set(iid, "progreso", progreso)
            self.tree.item(iid, tags=tags)

    def _set_total(self, frac: float) -> None:
        self.pb_total["value"] = frac * 100
        self.lbl_total_pct.configure(text=f"{frac:.0%}")

    def _reset_bars(self) -> None:
        for pb, lbl in ((self.pb_file, self.lbl_file_pct), (self.pb_total, self.lbl_total_pct)):
            pb["value"] = 0
            lbl.configure(text="0 %")

    def _set_status(self, text: str) -> None:
        self.lbl_status.configure(text=text)

    def _set_running(self, running: bool) -> None:
        st = "disabled" if running else "normal"
        for b in (self.btn_add, self.btn_folder, self.btn_remove, self.btn_clear, self.btn_convert):
            b.configure(state=st)
        self.btn_cancel.configure(state="normal" if running else "disabled")

    def open_out_dir(self) -> None:
        d = self.last_out_dir
        if d is None and self.var_out_mode.get() == "custom":
            d = Path(self.var_out_dir.get())
        if d and d.exists():
            open_path(d)

    def _on_close(self) -> None:
        if self._busy():
            if not messagebox.askyesno(APP_NAME, "Hay una conversión en curso. ¿Cancelar y salir?"):
                return
            self.cancel_event.set()
            self.worker.join(timeout=5)
        self.destroy()


def main() -> None:
    if os.name == "nt":  # nitidez en pantallas de alta resolución
        try:
            import ctypes
            ctypes.windll.shcore.SetProcessDpiAwareness(1)
        except Exception:
            pass
    App().mainloop()


if __name__ == "__main__":
    main()
