#!/usr/bin/env python3
"""Música original + efectos para «Cumpleaños de Milton».

Composición propia, sintetizada con numpy (sin muestras de terceros → sin problemas de licencia).
100 BPM, compás de 4/4 (1 compás = 2,4 s), tonalidad de Do mayor.
Se sincroniza con tools/events.json (generado por tools/events.mjs desde src/core.ts).

Estructura musical (tiempos en s):
   0.0 –  7.2  Ruleta      intriga: pulso grave, arpegio escaso, clics, riser
   7.2 – 14.4  Carrusel    energía: groove completo, bajo, arpegios
  14.4 – 21.6  Selección   tensión → acento en «¡MILTON!» (19.2)
  21.6 – 91.2  Recuerdos   groove constante; melodía en marimba; respira en las frases
  91.2 – 105   Cierre      balada: piano eléctrico + cuerdas, sin batería, fade-out final
"""
import json, sys
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 44100
rng = np.random.default_rng(7)
E = json.load(open('tools/events.json'))
BEAT, BAR = 60 / E['bpm'], 240 / E['bpm']
DUR = float(E['duration'])
N = int((DUR + 3) * SR)

BUS = {k: np.zeros((2, N)) for k in ['pad', 'keys', 'mar', 'bass', 'drums', 'sfx', 'sfxwet']}


def add(bus, sig, t0, gain=1.0, pan=0.0):
    sig = np.asarray(sig, dtype=np.float64)
    i = int(round(t0 * SR))
    if i >= N:
        return
    if i < 0:
        sig = sig[-i:]
        i = 0
    n = min(sig.shape[-1], N - i)
    if n <= 0:
        return
    if sig.ndim == 1:
        a = (pan + 1) * np.pi / 4
        BUS[bus][0, i:i + n] += sig[:n] * gain * np.cos(a)
        BUS[bus][1, i:i + n] += sig[:n] * gain * np.sin(a)
    else:
        BUS[bus][:, i:i + n] += sig[:, :n] * gain


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def T(n):
    return np.arange(n) / SR


def lp(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, fc, 'low', fs=SR, output='sos'), x)


def hp(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, fc, 'high', fs=SR, output='sos'), x)


def bp(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)


def release(n, off, rel):
    r = np.ones(n)
    off = min(off, n)
    m = min(int(rel * SR), n - off)
    if m > 0:
        r[off:off + m] = np.cos(np.linspace(0, np.pi / 2, m)) ** 2
        r[off + m:] = 0
    return r


# ────────────────────────── voces ──────────────────────────
def ep(f, dur, vel=1.0):
    """Piano eléctrico tipo Rhodes (FM suave)."""
    n = int((dur + 0.5) * SR)
    t = T(n)
    idx = 1.5 * np.exp(-t * 4.5) + 0.22
    sig = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * t))
    sig += 0.10 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 3.0)
    sig += 0.07 * np.sin(2 * np.pi * f * 6.9 * t + 0.4) * np.exp(-t * 24)
    amp = (1 - np.exp(-t / 0.004)) * np.exp(-t / (1.1 if f > 300 else 1.6))
    return sig * amp * release(n, int(dur * SR), 0.22) * vel


def mar(f, dur, vel=1.0):
    """Marimba / kalimba cálida."""
    n = int((dur + 0.35) * SR)
    t = T(n)
    sig = np.sin(2 * np.pi * f * t) * np.exp(-t * 5.2)
    sig += 0.42 * np.sin(2 * np.pi * f * 3.99 * t) * np.exp(-t * 17)
    sig += 0.16 * np.sin(2 * np.pi * f * 9.1 * t) * np.exp(-t * 38)
    amp = 1 - np.exp(-t / 0.002)
    return sig * amp * release(n, int((dur + 0.1) * SR), 0.2) * vel


def pad(freqs, dur, vel=1.0, att=0.9, rel=1.4):
    """Colchón de cuerdas suave (aditivo, ligeramente desafinado)."""
    n = int((dur + rel) * SR)
    t = T(n)
    sig = np.zeros(n)
    for f in freqs:
        for det, ph in ((-0.0035, 0.0), (0.0035, 1.3)):
            fs = f * (1 + det)
            for h in range(1, 7):
                sig += np.sin(2 * np.pi * fs * h * t + ph * h) / h ** 1.5
    sig = lp(sig, 2400)
    env = np.minimum(1, t / att) ** 1.5 * release(n, int(dur * SR), rel)
    return sig * env * vel / max(1, len(freqs)) * 0.8


def bass(f, dur, vel=1.0):
    n = int((dur + 0.12) * SR)
    t = T(n)
    sig = np.sin(2 * np.pi * f * t) + 0.28 * np.sin(2 * np.pi * f * 2 * t) + 0.08 * np.sin(2 * np.pi * f * 3 * t)
    amp = (1 - np.exp(-t / 0.006)) * (0.38 + 0.62 * np.exp(-t / 0.28))
    return sig * amp * release(n, int(dur * SR), 0.09) * vel


def kick(vel=1.0):
    n = int(0.45 * SR)
    t = T(n)
    f = 46 + 110 * np.exp(-t * 26)
    ph = 2 * np.pi * np.cumsum(f) / SR
    sig = np.sin(ph) * np.exp(-t * 9.5)
    sig += 0.25 * np.exp(-t * 400) * rng.standard_normal(n)
    return lp(sig, 5000) * vel


def clap(vel=1.0):
    n = int(0.3 * SR)
    t = T(n)
    noise = bp(rng.standard_normal(n), 900, 5200)
    env = np.exp(-t * 20)
    for d in (0.011, 0.023):
        env += np.exp(-np.clip(t - d, 0, None) * 26) * (t >= d) * 0.75
    return noise * env * 0.7 * vel


def hat(vel=1.0, open_=False):
    n = int((0.22 if open_ else 0.055) * SR)
    t = T(n)
    return hp(rng.standard_normal(n), 7200) * np.exp(-t * (14 if open_ else 80)) * vel * 0.8


def shaker(vel=1.0):
    n = int(0.07 * SR)
    t = T(n)
    return bp(rng.standard_normal(n), 4500, 9500) * np.exp(-t * 55) * vel


def crash(dur=2.2, vel=1.0):
    n = int(dur * SR)
    t = T(n)
    return hp(rng.standard_normal(n), 3200) * np.exp(-t * 2.4) * (1 - np.exp(-t / 0.004)) * vel * 0.6


def rev_cymbal(dur=1.4, vel=1.0):
    n = int(dur * SR)
    t = T(n)
    x = hp(rng.standard_normal(n), 3500)
    env = (t / dur) ** 2.6
    env[-int(0.02 * SR):] *= np.linspace(1, 0, int(0.02 * SR))
    return x * env * vel * 0.5


def boom(vel=1.0, dur=1.8):
    n = int(dur * SR)
    t = T(n)
    f = 42 + 70 * np.exp(-t * 6)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.4) * vel


def tick_snd(f=1700, vel=1.0):
    n = int(0.06 * SR)
    t = T(n)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 150) + 0.35 * np.sin(2 * np.pi * f * 2.3 * t) * np.exp(-t * 260)
    s += 0.5 * rng.standard_normal(n) * np.exp(-t * 700)
    return bp(s, 500, 9000) * vel


def ting(f, vel=1.0, dur=1.1):
    n = int(dur * SR)
    t = T(n)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 3.6)
    s += 0.34 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 7)
    s += 0.14 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 13)
    return s * (1 - np.exp(-t / 0.002)) * vel


def whoosh(dur=0.7, f0=350, f1=3200, p0=-0.5, p1=0.5, vel=1.0):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    cents = np.geomspace(f0, f1, 9)
    bands = [bp(noise, c / 1.45, c * 1.45) for c in cents]
    pos = np.linspace(0, 8, n)
    out = np.zeros(n)
    for k, b in enumerate(bands):
        out += np.clip(1 - np.abs(pos - k), 0, 1) * b
    x = np.linspace(0, 1, n)
    env = np.sin(np.pi * x ** 0.75) ** 2
    out *= env * vel
    pan = np.linspace(p0, p1, n)
    a = (pan + 1) * np.pi / 4
    return np.stack([out * np.cos(a), out * np.sin(a)])


# ────────────────────────── armonía ──────────────────────────
CH = {
    'C': dict(bass=36, v=[48, 55, 60, 64, 67], root=0),
    'G': dict(bass=43, v=[55, 59, 62, 67, 71], root=7),
    'Am': dict(bass=45, v=[57, 60, 64, 69, 72], root=9),
    'F': dict(bass=41, v=[53, 57, 60, 65, 69], root=5),
    'Dm': dict(bass=38, v=[50, 57, 62, 65, 69], root=2),
}


def build_chords():
    seq = []
    # Ruleta (intriga)
    seq += [(0.0, 'Am'), (BAR, 'F'), (2 * BAR, 'Dm'), (2.5 * BAR, 'G')]
    # Carrusel + selección + acento
    t = 3 * BAR
    for ch in ['C', 'G', 'Am', 'F', 'G', 'C']:
        seq.append((t, ch))
        t += BAR
    # Recuerdos: Do – Sol – Lam – Fa  (compases 9..36), compás 37: Sol
    loop = ['C', 'G', 'Am', 'F']
    for b in range(9, 37):
        seq.append((b * BAR, loop[(b - 9) % 4]))
    seq.append((37 * BAR, 'G'))
    # Cierre: cadencia rota (Sol → Lam) y resolución a Do
    seq += [(91.2, 'Am'), (93.6, 'F'), (96.0, 'C'), (98.4, 'G'), (99.6, 'C'), (101.4, 'Am'), (102.6, 'F'), (103.8, 'C')]
    out = []
    for i, (t0, ch) in enumerate(seq):
        t1 = seq[i + 1][0] if i + 1 < len(seq) else DUR + 1.5
        out.append((t0, t1, ch))
    return out


CHORDS = build_chords()
PHRASES = [(s['start'] - 0.25, s['start'] + s['dur'] + 0.1) for s in E['shots'] if s['kind'] == 'phrase']


def breath(t):
    """Atenuación de percusión en las frases (momentos pausados)."""
    for a, b in PHRASES:
        if a <= t <= b:
            return 0.32
    return 1.0


def drum_level(t):
    """Perfil de intensidad de la percusión a lo largo del video."""
    if t < 3 * BAR:
        return 0.0
    if t < 6 * BAR:
        return 1.0
    if t < 8 * BAR:
        return 0.55
    if t < 33 * BAR:
        return 0.95
    if t < 91.2:
        return float(np.interp(t, [33 * BAR, 91.0], [0.95, 0.5]))
    return 0.0


# ────────────────────────── música ──────────────────────────
MEL_A = {  # (inicio_en_tiempos, midi, duración_en_tiempos) por compás
    'C': [(0, 76, 1.5), (1.5, 74, .5), (2, 72, 1), (3, 74, .5), (3.5, 76, .5)],
    'G': [(0, 79, 1.5), (1.5, 76, .5), (2, 74, 1), (3, 71, 1)],
    'Am': [(0, 69, 1), (1, 72, .5), (1.5, 76, 1), (2.5, 81, 1.5)],
    'F': [(0, 79, 1), (1, 77, 1), (2, 76, 1), (3, 74, 1)],
}
MEL_B = {
    'C': [(0, 79, .5), (.5, 76, .5), (1, 84, 1.5), (2.5, 83, .5), (3, 79, 1)],
    'G': [(0, 86, 1.5), (1.5, 83, .5), (2, 79, 1), (3, 74, 1)],
    'Am': [(0, 84, 1), (1, 81, 1), (2, 76, 1), (3, 81, 1)],
    'F': [(0, 81, 1.5), (1.5, 79, .5), (2, 77, 1), (3, 76, .5), (3.5, 74, .5)],
}
ARP = [0, 2, 1, 3, 2, 4, 3, 2]  # patrón de corcheas sobre las notas del acorde


def chord_at(t):
    for a, b, ch in CHORDS:
        if a <= t < b:
            return ch
    return 'C'


def compose_music():
    # colchón de cuerdas
    for a, b, ch in CHORDS:
        if b <= 0 or a >= DUR + 0.5:
            continue
        g = 0.055
        if a < 7.2:
            g = 0.05 + 0.04 * (a / 7.2)
        elif a >= 91.2:
            g = 0.10
        elif a >= 21.6:
            g = 0.05
        v = CH[ch]['v']
        add('pad', pad([mtof(m) for m in v[:4]], (min(b, DUR + 1) - a) + 0.05, 1.0, att=0.7 if a > 7 else 1.4, rel=1.2), a, g)

    # bajo
    for a, b, ch in CHORDS:
        if a < 3 * BAR - 0.01 or a >= 91.2:
            continue
        f = mtof(CH[ch]['bass'])
        root_f = f
        fifth_f = f * 1.5
        dr = drum_level(a) > 0
        pat = [(0, 1.5, root_f, 1.0), (2, 0.5, root_f, 0.7), (2.5, 0.5, fifth_f, 0.65), (3, 0.9, root_f * 2, 0.55)]
        if a >= 8 * BAR - 0.01 and a < 33 * BAR:
            pass
        t = a
        while t < b - 0.01:
            for bt, d, ff, v in pat:
                tt = t + bt * BEAT
                if tt < b - 0.01:
                    add('bass', bass(ff, d * BEAT, v), tt, 0.165 * breath(tt) ** 0.4, 0.0)
            t += BAR
    # bajo de la intriga: pulso grave en la ruleta y drone
    for k, (a, ch) in enumerate([(BAR, 'F'), (2 * BAR, 'Dm')]):
        add('bass', bass(mtof(CH[ch]['bass']), BAR * 0.9, 0.7), a, 0.16)
    add('bass', bass(mtof(33), 3.0, 0.5), 0.2, 0.12)

    # piano eléctrico: arpegios y acordes
    for a, b, ch in CHORDS:
        v = CH[ch]['v']
        up = [m + 12 for m in v[1:]] + [v[0] + 12]
        if a < 3 * BAR - 0.01:
            # intriga: arpegio escaso en octava alta, cada vez más presente
            for k in range(int((b - a) / BEAT)):
                if k % 2 == 1:
                    continue
                tt = a + k * BEAT
                note = v[[1, 3, 2, 4][(k // 2) % 4]] + 12
                lvl = 0.05 + 0.10 * (tt / 7.0)
                add('keys', ep(mtof(note), 0.55, 1.0), tt, lvl, -0.25 + 0.5 * ((k // 2) % 2))
            continue
        if 91.2 <= a:
            continue
        t = a
        while t < b - 0.01:
            for k in range(8):
                tt = t + k * BEAT / 2
                if tt >= b - 0.01:
                    break
                note = (v + [v[0] + 12, v[1] + 12])[ARP[k]] + (12 if 21.6 <= a < 60 and False else 0)
                vel = 0.8 if k % 2 == 0 else 0.55
                base = 0.14 if a >= 21.6 else 0.15
                if 14.4 <= a < 21.6:
                    base = 0.15 + 0.04 * (a - 14.4) / 7.2
                add('keys', ep(mtof(note + 12), 0.6, vel), tt, base * (0.8 if breath(tt) < 1 else 1.0), -0.3 + 0.6 * (k / 7))
            # acorde en el tiempo 1 (golpe corto)
            if drum_level(t) > 0.5:
                for m in v[1:4]:
                    add('keys', ep(mtof(m), 0.45, 0.7), t, 0.045, 0.0)
            t += BAR

    # marimba: melodía en los recuerdos (compases 9–37)
    loop = ['C', 'G', 'Am', 'F']
    for b in range(9, 38):
        L = (b - 9) // 4
        ch = chord_at(b * BAR + 0.1)
        if ch not in MEL_A:
            continue
        if b >= 37:
            continue
        if b < 33:
            mel = MEL_A if L % 2 == 0 else MEL_B
        else:
            mel = MEL_A
        lvl = {0: 0.15, 1: 0.17, 2: 0.2, 3: 0.2, 4: 0.22, 5: 0.22, 6: 0.17, 7: 0.14}.get(L, 0.14)
        for bt, m, d in mel[ch]:
            tt = b * BAR + bt * BEAT
            if breath(tt) < 1:
                continue  # en las frases la melodía calla
            add('mar', mar(mtof(m), d * BEAT, 0.9), tt, lvl, 0.15)
            if L >= 4:  # campanita superior en la sección más llena
                add('mar', mar(mtof(m + 12), d * BEAT, 0.5), tt + 0.012, lvl * 0.35, -0.2)
    # contra-melodía suave (EP agudo) en la sección central
    for b in range(17, 33):
        ch = chord_at(b * BAR + 0.1)
        v = CH[ch]['v']
        tt = b * BAR + 2 * BEAT
        if breath(tt) < 1:
            continue
        add('keys', ep(mtof(v[3] + 12), 1.2, 0.7), tt, 0.07, 0.3)

    # intriga en la ruleta: motivo de marimba con eco
    for k, (tt, m) in enumerate([(0.6, 69), (1.2, 76), (1.8, 72), (2.4, 76), (3.0, 65), (3.6, 72), (4.2, 69), (4.8, 74), (5.4, 62), (6.0, 67)]):
        add('mar', mar(mtof(m + 12), 0.4, 0.8), tt, 0.07 + 0.05 * k / 10, -0.3 + 0.6 * (k % 2))

    # cierre: melodía lenta en piano eléctrico
    CLOSEM = [(91.2, 76, 1.2), (92.4, 74, .6), (93.0, 72, .6), (93.6, 72, 1.2), (94.8, 69, .6), (95.4, 72, .6), (96.0, 76, 1.0), (97.0, 79, 1.0), (98.0, 76, .6),
              (98.4, 74, 1.2), (99.6, 84, 1.8), (101.4, 83, .6), (102.0, 81, .6), (102.6, 81, 1.2), (103.8, 76, 1.2)]
    for tt, m, d in CLOSEM:
        add('keys', ep(mtof(m), d, 0.85), tt, 0.21, 0.1)
    # cierre: arpegio lento de acompañamiento
    for a, b, ch in CHORDS:
        if a < 91.2:
            continue
        v = CH[ch]['v']
        k = 0
        t = a
        while t < b - 0.05:
            note = v[[0, 2, 1, 3, 2, 4][k % 6]]
            add('keys', ep(mtof(note), 0.9, 0.6), t, 0.10, -0.2)
            t += BEAT
            k += 1


def compose_drums():
    # corazón suave en la ruleta
    for b in (1, 2):
        add('drums', kick(0.5), b * BAR + 0.0, 0.30)
        add('drums', kick(0.35), b * BAR + 2 * BEAT, 0.24)
    t = 3 * BAR
    while t < 91.2 - 0.01:
        b = int(round(t / BAR))
        lv = drum_level(t)
        if lv > 0:
            for k in range(8):
                tt = t + k * BEAT / 2
                if tt >= 91.2:
                    break
                g = lv * breath(tt)
                if k % 2 == 0:
                    add('drums', hat(0.7 + 0.2 * (k % 4 == 0)), tt, 0.085 * g, 0.2)
                else:
                    add('drums', hat(0.9, open_=(k == 7)), tt, 0.075 * g, 0.2)
            for k in range(16):
                tt = t + k * BEAT / 4
                if tt < 91.2 and k % 2 == 1:
                    add('drums', shaker(0.6), tt, 0.05 * lv * breath(tt), -0.3)
            kicks = [0, 2] + ([2.75] if b % 2 == 1 else []) + ([3.5] if b % 4 == 3 else [])
            if 6 * BAR <= t < 8 * BAR:
                kicks = [0] + ([2.5] if b == 7 else [])
            for kb in kicks:
                tt = t + kb * BEAT
                add('drums', kick(1.0), tt, 0.44 * lv * (0.35 + 0.65 * breath(tt)), 0.0)
            if not (6 * BAR <= t < 8 * BAR):
                for sb in (1, 3):
                    tt = t + sb * BEAT
                    add('drums', clap(0.9), tt, 0.26 * lv * breath(tt), 0.05)
        t += BAR
    # redoble de tensión antes de «¡MILTON!» (compás 7, último tiempo) y de la llegada del carrusel
    for k in range(8):
        tt = 8 * BAR - 2 * BEAT + k * BEAT / 4
        add('drums', clap(0.6 + 0.4 * k / 8), tt, 0.10 + 0.22 * k / 8, 0.0)
    for k in range(6):
        tt = 3 * BAR - BEAT + k * BEAT / 6
        add('drums', hat(0.9), tt, 0.05 + 0.08 * k / 6, 0.0)
    # acentos
    add('drums', crash(2.6, 0.9), 3 * BAR, 0.20)
    add('drums', kick(1.0), 3 * BAR, 0.6)
    add('drums', crash(3.2, 1.0), 8 * BAR, 0.28)
    add('drums', kick(1.0), 8 * BAR, 0.62)
    # último suspiro de la percusión en el cierre
    add('drums', kick(0.5), 91.2, 0.28)


def compose_sfx():
    ticks = E['ticks']
    for i, tt in enumerate(ticks):
        gap = (ticks[i + 1] - tt) if i + 1 < len(ticks) else 0.5
        v = 0.17 + 0.20 * np.clip(gap / 0.4, 0, 1)
        f = 1500 + 400 * rng.random() + (100 if i % 2 else 0)
        add('sfx', tick_snd(f, 1.0), tt, v, -0.15 + 0.3 * (i % 2))
    last = ticks[-1]
    add('sfx', tick_snd(900, 1.0), last, 0.42)
    add('sfx', boom(0.9, 1.4), last, 0.20)
    # OCTUBRE se ilumina: brillo cálido
    for k, f in enumerate([523.25, 659.25, 783.99, 1046.5, 1318.5]):
        add('sfxwet', ting(f, 1.0, 1.6), 6.0 + k * 0.07, 0.11 * (0.85 ** k), -0.3 + 0.15 * k)
    # riser hacia el carrusel
    add('sfx', rev_cymbal(1.2, 1.0), 3 * BAR - 1.2, 0.30)
    # carrusel: las fotos entran desde las esquinas
    for k, (dt, p0, p1) in enumerate([(-0.25, -1, 0), (-0.1, 1, 0), (0.05, -1, 0.2), (0.2, 1, -0.2), (0.4, -0.8, 0.5), (0.6, 0.8, -0.5)]):
        add('sfx', whoosh(0.8, 300 + 90 * k, 3200, p0, p1, 1.0), 3 * BAR + dt, 0.09)
    add('sfx', whoosh(1.4, 250, 2600, -0.7, 0.7, 1.0), 3 * BAR + 0.9, 0.07)
    # selección de la foto: marcas y desplazamiento
    add('sfxwet', ting(1568, 1.0, 1.2), 13.2, 0.12, 0.2)
    add('sfxwet', ting(2093, 1.0, 1.2), 13.32, 0.09, -0.2)
    add('sfx', tick_snd(1100, 1.0), 14.15, 0.3)
    add('sfx', whoosh(1.3, 220, 2000, 0.6, -0.4, 1.0), 14.25, 0.12)
    # escritura de «Feliz cumpleaños»
    for i in range(16):
        add('sfx', tick_snd(2300 + 300 * rng.random(), 0.8), 16.8 + i * 0.07, 0.055, -0.1 + 0.2 * (i % 2))
    # ¡MILTON!: golpe, brillo y confeti
    t0 = E['T']['nameHit']
    add('sfx', rev_cymbal(1.2, 1.0), t0 - 1.2, 0.30)
    add('sfx', boom(1.0, 2.2), t0, 0.34)
    for k, f in enumerate([1046.5, 1318.5, 1568.0, 2093.0, 1760.0, 2637.0, 3136.0]):
        add('sfxwet', ting(f, 1.0, 1.8), t0 + 0.04 + k * 0.075, 0.12 * (0.88 ** k), -0.6 + 0.2 * k)
    add('sfx', whoosh(1.2, 400, 5000, -0.9, 0.9, 1.0), t0 - 0.05, 0.10)
    for i in range(16):
        add('sfx', tick_snd(2800 + 900 * rng.random(), 0.6), t0 + 0.1 + rng.random() * 1.2, 0.05, -0.8 + 1.6 * rng.random())

    # recorrido: transiciones sutiles
    for s in E['shots']:
        t0 = s['start']
        g = 0.095 if s['flare'] else 0.065
        f0 = 380 + 160 * rng.random()
        d = 0.75
        p0, p1 = (-0.6, 0.6) if rng.random() < 0.5 else (0.6, -0.6)
        add('sfx', whoosh(d, f0, 2600 + 800 * rng.random(), p0, p1, 1.0), t0 - d * 0.5, g)
        if s['flare']:
            add('sfxwet', ting(2093 + 200 * rng.random(), 1.0, 1.4), t0 - 0.05, 0.07, 0.3)
            add('sfxwet', ting(2637, 1.0, 1.4), t0 + 0.07, 0.05, -0.3)
        if s['swap']:
            add('sfx', whoosh(0.8, 300, 1800, -0.5, 0.5, 1.0), t0 + s['dur'] * 0.5 - 0.4, 0.045)
        if s['kind'] == 'phrase':
            # la frase se escribe letra a letra (0,036 s por carácter, desde start-0,1)
            ci = 0
            for em, L in zip(s['words'], s['wordLens']):
                tw = t0 - 0.1 + ci * 0.036
                add('sfx', tick_snd(1200, 0.7), tw, 0.05, 0.0)
                if em:
                    add('sfxwet', ting(1568, 1.0, 1.4), tw + L * 0.036 + 0.1, 0.075, 0.0)
                ci += L + 1
        if s['nItems'] >= 3:
            add('sfx', whoosh(0.7, 300, 2200, -0.6, 0.6, 1.0), t0 + 0.3, 0.04)
            add('sfx', whoosh(0.7, 300, 2200, -0.6, 0.6, 1.0), t0 + 0.65, 0.04)
    # cierre
    for k in range(12):
        add('sfx', tick_snd(900 + 80 * k, 0.9), 90.9 + k * 0.1 + 0.08, 0.05, -0.8 + 1.6 * (k / 11))
    add('sfx', whoosh(1.4, 250, 2800, -0.8, 0.8, 1.0), 90.8, 0.09)
    # mensaje: destellos en las palabras con valor emocional
    for k, tt in enumerate([94.3 + 3 * 0.205 + 0.3 + i * 0.205 for i in range(0)]):
        pass
    msg_words = [7, 5, 3, 2]
    n = 0
    for li, cnt in enumerate(msg_words):
        for wi in range(cnt):
            tt = 94.3 + n * 0.205 + (li * 0.12 if li > 0 else 0)
            em = (li == 1 and wi >= 3) or (li == 2 and wi <= 1) or li == 3
            if em:
                add('sfxwet', ting([1318.5, 1568.0, 1760.0][n % 3], 1.0, 1.6), tt + 0.15, 0.07, -0.2 + 0.4 * (n % 2))
            n += 1
    add('sfx', whoosh(0.8, 300, 2400, -0.4, 0.4, 1.0), 99.0, 0.06)
    # ¡Feliz cumpleaños!
    for k, f in enumerate([1046.5, 1318.5, 1568.0, 2093.0, 2637.0]):
        add('sfxwet', ting(f, 1.0, 2.2), 99.45 + k * 0.09, 0.12 * (0.9 ** k), -0.4 + 0.2 * k)
    add('sfx', boom(0.5, 1.8), 99.5, 0.18)
    # firma y logotipo
    add('sfxwet', ting(1568, 1.0, 1.8), 101.6, 0.08, -0.15)
    add('sfxwet', ting(1318.5, 1.0, 1.8), 102.2, 0.07, 0.15)
    add('sfxwet', ting(2093, 1.0, 2.4), 102.9, 0.09, 0.0)
    add('sfxwet', ting(1046.5, 1.0, 2.6), 103.0, 0.08, 0.0)


# ────────────────────────── mezcla ──────────────────────────
def reverb_ir(sec, decay, seed):
    r = np.random.default_rng(seed)
    n = int(sec * SR)
    t = T(n)
    ir = np.stack([r.standard_normal(n), r.standard_normal(n)]) * np.exp(-t * decay)
    ir[:, :int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
    ir = np.stack([lp(ir[0], 5500), lp(ir[1], 5500)])
    ir /= np.sqrt((ir ** 2).sum(axis=1, keepdims=True)) * 0.5
    return ir


def conv(x, ir):
    return np.stack([signal.fftconvolve(x[0], ir[0])[:N], signal.fftconvolve(x[1], ir[1])[:N]])


def main():
    compose_music()
    compose_drums()
    compose_sfx()

    room = reverb_ir(2.4, 2.3, 11)
    hall = reverb_ir(3.4, 1.5, 12)

    music_dry = BUS['pad'] * 0.9 + BUS['keys'] * 0.8 + BUS['mar'] * 0.8 + BUS['bass'] + BUS['drums']
    send = BUS['pad'] * 0.55 + BUS['keys'] * 0.30 + BUS['mar'] * 0.35 + BUS['drums'] * 0.06
    wet = conv(send, hall) * 0.30
    sfx_wet = conv(BUS['sfxwet'] * 1.0 + BUS['sfx'] * 0.12, room) * 0.55
    mix = music_dry + wet + BUS['sfx'] + BUS['sfxwet'] * 0.45 + sfx_wet

    # filtros de seguridad y compresión suave
    mix = np.stack([hp(mix[0], 28), hp(mix[1], 28)])
    mix = np.stack([lp(mix[0], 17000), lp(mix[1], 17000)])

    # desvanecimiento final delicado y arranque suave
    t = T(N)
    fade_out = np.clip((DUR - t) / (DUR - 101.6), 0, 1)
    fade_out = np.sin(fade_out * np.pi / 2) ** 1.6
    fade_in = np.clip(t / 0.35, 0, 1)
    mix *= fade_out * fade_in

    # normalización: pico ≈ -1,2 dBFS con limitador tanh suave
    peak = np.abs(mix).max()
    mix = mix / peak * 0.95
    mix = np.tanh(mix * 1.9) / np.tanh(1.9)
    mix = mix[:, :int(DUR * SR)]
    out = (mix.T * 32767 * 0.89).astype(np.int16)
    wavfile.write(sys.argv[1] if len(sys.argv) > 1 else 'out/milton_music.wav', SR, out)
    print('ok', out.shape, 'pico', np.abs(out).max() / 32767)


if __name__ == '__main__':
    main()
