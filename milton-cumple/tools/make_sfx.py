#!/usr/bin/env python3
"""Efectos de sonido para «Cumpleaños de Milton» (sin música).

Uso:  python3 tools/make_sfx.py efectos  out/sfx_efectos.wav   → todos los efectos
      python3 tools/make_sfx.py ruleta   out/sfx_ruleta.wav    → solo los sonidos de la ruleta

Familia sonora coherente (todo sintetizado con numpy, sin muestras de terceros):
  · swish   → un objeto entra, sale o se desplaza (ruido filtrado con barrido)
  · toque   → la polaroid se posa sobre la mesa (golpe grave seco + clic de papel)
  · lápiz   → algo se dibuja (garabatos, subrayados, marco)
  · tecla   → el texto se escribe (ticks suaves)
  · oleaje  → el fondo cambia entre papel y pizarra (swell grave)
  · brillo  → acentos puntuales (nombre, felicitación, logotipo)
Los tiempos salen de tools/events.json (src/core.ts), de modo que siguen a la animación.
"""
import json, sys
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 44100
rng = np.random.default_rng(11)
E = json.load(open('tools/events.json'))
DUR = float(E['duration'])
N = int((DUR + 2) * SR)
TR = E['TR']
BUS = {k: np.zeros((2, N)) for k in ['dry', 'wet']}


def add(sig, t0, gain=1.0, pan=0.0, bus='dry'):
    sig = np.asarray(sig, dtype=np.float64)
    i = int(round(t0 * SR))
    if i >= N or i + sig.shape[-1] <= 0:
        return
    if i < 0:
        sig = sig[..., -i:]
        i = 0
    n = min(sig.shape[-1], N - i)
    if sig.ndim == 1:
        a = (np.clip(pan, -1, 1) + 1) * np.pi / 4
        BUS[bus][0, i:i + n] += sig[:n] * gain * np.cos(a)
        BUS[bus][1, i:i + n] += sig[:n] * gain * np.sin(a)
    else:
        BUS[bus][:, i:i + n] += sig[:, :n] * gain


def T(n):
    return np.arange(n) / SR


def bp(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)


def hp(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, fc, 'high', fs=SR, output='sos'), x)


def lp(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, fc, 'low', fs=SR, output='sos'), x)


# ───────────────────────── voces ─────────────────────────
def swish(dur=0.55, f0=450, f1=2600, p0=-0.4, p1=0.4):
    """Objeto en movimiento: ruido con barrido de filtro y envolvente suave."""
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    cents = np.geomspace(f0, f1, 8)
    bands = [bp(noise, c / 1.5, c * 1.5) for c in cents]
    pos = np.linspace(0, 7, n)
    out = sum(np.clip(1 - np.abs(pos - k), 0, 1) * b for k, b in enumerate(bands))
    x = np.linspace(0, 1, n)
    out = out * np.sin(np.pi * x ** 0.8) ** 2
    pan = np.linspace(p0, p1, n)
    a = (pan + 1) * np.pi / 4
    return np.stack([out * np.cos(a), out * np.sin(a)])


def toque(size=1.0):
    """Polaroid que se posa sobre la mesa: golpe grave breve + clic de papel."""
    n = int(0.16 * SR)
    t = T(n)
    f = 62 + 85 * np.exp(-t * 55)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 38)
    click = bp(rng.standard_normal(n), 900, 4200) * np.exp(-t * 170) * 0.55
    return (body * 0.9 * size + click) * (1 - np.exp(-t / 0.0007))


def lapiz(dur=1.0, vel=1.0):
    """Trazo de lápiz/tiza: ruido agudo modulado por trazos irregulares."""
    n = int(dur * SR)
    x = bp(rng.standard_normal(n), 2200, 7500)
    env = np.zeros(n)
    i = 0
    while i < n:
        L = int(rng.uniform(0.07, 0.16) * SR)
        env[i:i + L] = rng.uniform(0.35, 1.0)
        i += L
    env = lp(env, 38, 1)
    fade = np.minimum(1, np.minimum(np.arange(n), n - np.arange(n)) / (0.06 * SR))
    return x * np.clip(env, 0, None) * fade * vel


def tecla(f=None):
    f = f or (1100 + 900 * rng.random())
    n = int(0.05 * SR)
    t = T(n)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 170) + 0.4 * np.sin(2 * np.pi * f * 2.4 * t) * np.exp(-t * 300)
    s += 0.5 * rng.standard_normal(n) * np.exp(-t * 650)
    return bp(s, 450, 8500)


def oleaje(dur=1.0):
    """Cambio de fondo: swell grave con un toque de aire."""
    n = int(dur * SR)
    t = T(n)
    x = lp(rng.standard_normal(n), 900) * (np.sin(np.pi * np.linspace(0, 1, n) ** 0.9) ** 2)
    sub = np.sin(2 * np.pi * (70 + 30 * np.linspace(0, 1, n)) * t) * np.sin(np.pi * np.linspace(0, 1, n)) ** 2 * 0.5
    air = hp(rng.standard_normal(n), 3500) * np.sin(np.pi * np.linspace(0, 1, n)) ** 3 * 0.25
    return x * 1.2 + sub + air


def brillo(f, vel=1.0, dur=1.6):
    n = int(dur * SR)
    t = T(n)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 3.4)
    s += 0.32 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 7)
    s += 0.12 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 13)
    return s * (1 - np.exp(-t / 0.002)) * vel


def boom(vel=1.0, dur=1.4):
    n = int(dur * SR)
    t = T(n)
    f = 44 + 66 * np.exp(-t * 6)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.8) * vel


def puff(dur=0.3):
    n = int(dur * SR)
    t = T(n)
    return bp(rng.standard_normal(n), 500, 3600) * np.exp(-t * 14) * (1 - np.exp(-t / 0.004))


def clunk():
    n = int(0.5 * SR)
    t = T(n)
    s = np.sin(2 * np.pi * 180 * t) * np.exp(-t * 20) + 0.5 * np.sin(2 * np.pi * 410 * t) * np.exp(-t * 34)
    s += 0.6 * bp(rng.standard_normal(n), 800, 3500) * np.exp(-t * 120)
    return s


PAN_ENTER = {'slideL': (-0.8, 0.0), 'rotL': (-0.7, 0.0), 'slideR': (0.8, 0.0), 'rotR': (0.7, 0.0), 'rise': (0.0, 0.0), 'drop': (0.0, 0.0), 'pop': (0.0, 0.0)}
PAN_EXIT = {'swipeL': (0.0, -0.8), 'swipeR': (0.0, 0.8), 'swipeUp': (0.0, 0.0), 'swipeDown': (0.0, 0.0), 'lift': (0.0, 0.0)}


# ───────────────────────── ruleta ─────────────────────────
def ruleta():
    ticks = E['ticks']
    for i, tt in enumerate(ticks):
        gap = (ticks[i + 1] - tt) if i + 1 < len(ticks) else 0.5
        v = 0.2 + 0.22 * np.clip(gap / 0.4, 0, 1)
        add(tecla(1500 + 400 * rng.random() + (100 if i % 2 else 0)), tt, v, -0.15 + 0.3 * (i % 2))
    last = ticks[-1]
    add(clunk(), last, 0.22)
    add(boom(0.8, 1.2), last, 0.10)
    for k, f in enumerate([523.25, 659.25, 783.99, 1046.5, 1318.5]):  # OCTUBRE se ilumina
        add(brillo(f, 1.0, 1.6), 6.0 + k * 0.07, 0.10 * (0.85 ** k), -0.3 + 0.15 * k, 'wet')


# ───────────────────────── efectos del video ─────────────────────────
def type_text(t_start, n_chars, rate, every=1, vel=0.05, pan=0.0):
    for i in range(0, n_chars, every):
        add(tecla(), t_start + i * rate, vel * (0.75 + 0.5 * rng.random()), pan + (rng.random() - 0.5) * 0.3)


def efectos():
    ruleta()
    T0 = E['T']
    # ── transformación de la ruleta → papel + carrusel
    add(swish(1.4, 250, 2400, -0.6, 0.6), 6.55, 0.10)
    add(oleaje(1.5), 6.6, 0.07)
    for k, (dt, p0, p1) in enumerate([(-0.15, -1, 0), (0.0, 1, 0), (0.12, -1, 0.2), (0.25, 1, -0.2), (0.4, -0.8, 0.5), (0.55, 0.8, -0.5)]):
        add(swish(0.75, 380 + 70 * k, 2800, p0, p1), 7.05 + dt, 0.075)
    for k in range(8):  # las primeras polaroids se posan
        add(toque(0.7), 7.7 + 0.13 * k + rng.random() * 0.05, 0.07, -0.8 + 1.6 * rng.random())
    # ── selección de la foto
    add(lapiz(0.9, 1.0), 13.2, 0.05, 0.0)
    add(brillo(1568, 1.0, 1.2), 14.05, 0.06, 0.2, 'wet')
    add(swish(1.3, 260, 2200, 0.5, -0.3), 14.25, 0.10)
    add(swish(1.0, 300, 1800, 0.3, 0.8), 14.5, 0.05)
    add(puff(0.15), 15.9, 0.10)  # la cinta se pega
    # ── «Feliz cumpleaños» (escritura) y «¡MILTON!»
    type_text(T0['greetStart'], 16, 0.07, 1, 0.06, 0.3)
    t0 = T0['nameHit']
    for i in range(8):
        add(toque(0.75), t0 + 0.12 + i * 0.06 + 0.2, 0.11, -0.4 + 0.12 * i)
    add(boom(0.7, 1.4), t0 + 0.1, 0.09)
    add(puff(0.35), t0 + 0.12, 0.10)
    for k, f in enumerate([1046.5, 1318.5, 1568.0, 2093.0, 1760.0, 2637.0]):
        add(brillo(f, 1.0, 1.6), t0 + 0.55 + k * 0.08, 0.07 * (0.88 ** k), -0.5 + 0.2 * k, 'wet')
    add(lapiz(0.9, 1.0), t0 + 0.55, 0.05, 0.3)
    add(lapiz(1.5, 1.0), t0 + 0.5, 0.035, 0.7)
    add(lapiz(1.4, 1.0), t0 + 1.0, 0.035, 0.8)
    add(swish(0.75, 300, 2000, 0.0, -0.8), 21.2, 0.09)

    # ── cambios de fondo (papel ↔ pizarra)
    for ev in E['bg'][1:]:
        add(oleaje(ev['dur'] + 0.35), ev['t'] - 0.05, 0.07)

    # ── recorrido
    for s in E['shots']:
        st, dur = s['start'], s['dur']
        if s['kind'] == 'phrase':
            ci = 0
            t_type = st - 0.1
            total = sum(L + 1 for L in s['wordLens'])
            type_text(t_type, total, 0.036, 2, 0.04, 0.0)
            for em, L in zip(s['words'], s['wordLens']):
                if em:
                    add(lapiz(0.5, 1.0), t_type + (ci + L) * 0.036, 0.04, 0.0)
                ci += L + 1
            add(lapiz(1.4, 1.0), st + 0.25, 0.03, -0.7)
            add(lapiz(1.4, 1.0), st + 0.5, 0.03, 0.7)
            add(swish(0.6, 300, 1500, 0.0, 0.0), st + dur - 0.45, 0.04)
            continue
        for it in s['items']:
            d = it['delay']
            t_in = st - TR + d
            p0, p1 = PAN_ENTER[it['enter']]
            add(swish(0.55, 420, 2500, p0, p1), t_in, 0.09)
            add(toque(1.0), st + 0.09 + d, 0.15, p1 if p1 else (p0 * 0.4))
            t_out = st + dur - TR + 0.4 * d + 0.2
            q0, q1 = PAN_EXIT[it['exit']]
            add(swish(0.5, 380, 2200, q0, q1), t_out, 0.07)
        if s['swap']:
            add(swish(0.8, 300, 1800, -0.5, 0.5), st + dur * 0.5 - 0.4, 0.045)
        if s['chapter']:
            add(lapiz(0.8, 1.0), st + 0.1, 0.03, -0.8)
            add(lapiz(0.7, 1.0), st + 0.6, 0.025, -0.8)
        if s['doodle']:
            add(lapiz(1.5, 1.0), st + 0.15, 0.035, 0.6)

    # ── cierre
    C = E['close']
    r = np.random.default_rng(3)
    add(swish(1.2, 250, 2400, -0.6, 0.6), 90.7, 0.08)
    for k in range(12):
        col, row = k % 6, k // 6
        dist = np.hypot(col - 2.5, row - 0.5)
        add(toque(0.7), C['mosaicIn'] + dist * 0.11 + 0.62 + r.random() * 0.05, 0.10, (col - 2.5) * 0.3)
    add(swish(1.2, 300, 2000, 0.2, -0.4), C['mosaicHold'] + 0.1, 0.06)
    # mensaje (palabra a palabra)
    n = 0
    for li, cnt in enumerate([7, 5, 3, 2]):
        for wi in range(cnt):
            tt = C['msgStart'] + n * 0.205 + (li * 0.12 if li > 0 else 0)
            add(tecla(900 + 150 * (n % 5)), tt + 0.05, 0.035, 0.0)
            em = (li == 1 and wi >= 3) or (li == 2 and wi <= 1) or li == 3
            if em:
                add(lapiz(0.45, 1.0), tt + 0.45, 0.03, 0.0)
            n += 1
    # ¡Feliz cumpleaños!
    th = C['happy']
    type_text(th, 18, 0.055, 1, 0.06, 0.0)
    add(boom(0.5, 1.4), th + 0.15, 0.12)
    for k, f in enumerate([1046.5, 1318.5, 1568.0, 2093.0]):
        add(brillo(f, 1.0, 1.8), th + 1.0 + k * 0.09, 0.06 * (0.9 ** k), -0.3 + 0.2 * k, 'wet')
    add(lapiz(0.9, 1.0), th + 1.1, 0.04, 0.0)
    # firma y logotipo
    add(swish(0.6, 300, 1800, -0.2, 0.2), C['signStart'] + 0.05, 0.05)
    add(swish(0.6, 300, 1800, -0.2, 0.2), C['signStart'] + 0.7, 0.05)
    add(lapiz(1.4, 1.0), C['signStart'] + 0.2, 0.03, -0.7)
    add(lapiz(1.4, 1.0), C['signStart'] + 0.5, 0.03, 0.7)
    add(brillo(2093, 1.0, 2.0), C['logoIn'] + 0.1, 0.05, 0.0, 'wet')
    add(brillo(1046.5, 1.0, 2.2), C['logoIn'] + 0.12, 0.04, 0.0, 'wet')


def reverb_ir(sec, decay, seed):
    rr = np.random.default_rng(seed)
    n = int(sec * SR)
    ir = np.stack([rr.standard_normal(n), rr.standard_normal(n)]) * np.exp(-T(n) * decay)
    ir[:, :int(0.01 * SR)] *= np.linspace(0, 1, int(0.01 * SR))
    ir = np.stack([lp(ir[0], 5500), lp(ir[1], 5500)])
    ir /= np.sqrt((ir ** 2).sum(axis=1, keepdims=True)) * 0.5
    return ir


def main():
    mode = sys.argv[1]
    out_path = sys.argv[2]
    (ruleta if mode == 'ruleta' else efectos)()
    ir = reverb_ir(1.8, 2.6, 5)
    wet = np.stack([signal.fftconvolve(BUS['wet'][c] + BUS['dry'][c] * 0.10, ir[c])[:N] for c in range(2)])
    mix = BUS['dry'] + BUS['wet'] * 0.5 + wet * 0.45
    mix = np.stack([hp(mix[0], 30), hp(mix[1], 30)])
    mix = np.stack([lp(mix[0], 16500), lp(mix[1], 16500)])
    peak = np.abs(mix).max()
    mix = mix / peak * 0.80
    mix = np.tanh(mix * 2.2) / np.tanh(2.2)
    mix = mix[:, :int(DUR * SR)]
    wavfile.write(out_path, SR, (mix.T * 32767 * 0.92).astype(np.int16))
    print('ok', mode, mix.shape, 'pico', float(np.abs(mix).max()))


if __name__ == '__main__':
    main()
