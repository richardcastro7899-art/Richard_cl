#!/usr/bin/env python3
"""
Diseño de sonido del motion graphic (síntesis, sin muestras externas ni música).

Criterios (motion graphics de gama alta):
  · contención: sonidos táctiles, secos y de poco volumen que refuerzan lo que se ve;
  · whooshes ajustados a la dirección/velocidad del movimiento, con el pico en el
    fotograma más rápido (por eso arrancan antes del corte);
  · impactos exactamente en el fotograma del aterrizaje;
  · todos los tonos en una sola escala (re mayor pentatónica) para que nada «desafine»;
  · variación de tono/volumen en cada evento para que no suene mecánico;
  · jerarquía: el cue más rico va al movimiento más grande.

Uso:  python3 build_sfx.py  →  ../public/sfx.wav  (48 kHz, estéreo, 16 bit) + sfx_events.json
Los tiempos replican src/theme.ts (START) y las animaciones de src/scenes.tsx.
"""
import json
import math
import os
import wave

import numpy as np
from scipy import signal

SR = 48000
FPS = 30
DURATION_F = 707
T_END = DURATION_F / FPS
N = int((T_END + 1.5) * SR)
rng = np.random.default_rng(11)

dry_l = np.zeros(N)
dry_r = np.zeros(N)
send = np.zeros((2, N))
LOG = []

PENT = [587.33, 659.25, 739.99, 880.00, 987.77, 1174.66, 1318.51, 1479.98, 1760.00]  # re mayor pentatónica


def rf(x):  # Math.round de JS
    return int(math.floor(x + 0.5))


def fr(f):
    return f / FPS


def tt(d):
    return np.arange(int(d * SR)) / SR


def lowpass(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), 'low')
    return signal.lfilter(b, a, x)


def highpass(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), 'high')
    return signal.lfilter(b, a, x)


def bandpass(x, lo, hi, order=2):
    b, a = signal.butter(order, [lo / (SR / 2), hi / (SR / 2)], 'band')
    return signal.lfilter(b, a, x)


def att(x, ms=1.0):
    n = max(1, int(ms * SR / 1000))
    env = np.ones(len(x))
    env[:n] = np.linspace(0, 1, n)
    return x * env


def beta_env(n, peak):
    x = np.linspace(0, 1, n)
    p, q = max(0.4, peak * 4.0), max(0.4, (1 - peak) * 4.0)
    e = x ** p * (1 - x) ** q
    return e / e.max()


def place(sig, t, gain=1.0, pan=0.0, wet=0.12, name=''):
    """Mono → bus con panorama de potencia constante."""
    i = int(round(t * SR))
    if i < 0:
        sig = sig[-i:]
        i = 0
    n = min(len(sig), N - i)
    if n <= 0:
        return
    a = (pan + 1) * math.pi / 4
    s = sig[:n] * gain
    dry_l[i:i + n] += s * math.cos(a)
    dry_r[i:i + n] += s * math.sin(a)
    send[0, i:i + n] += s * wet * math.cos(a)
    send[1, i:i + n] += s * wet * math.sin(a)
    LOG.append({'t': round(t, 3), 'name': name, 'gain': round(gain, 3)})


def place_st(l, r, t, gain=1.0, wet=0.12, name=''):
    i = int(round(t * SR))
    n = min(len(l), N - i)
    if n <= 0:
        return
    dry_l[i:i + n] += l[:n] * gain
    dry_r[i:i + n] += r[:n] * gain
    send[0, i:i + n] += l[:n] * gain * wet
    send[1, i:i + n] += r[:n] * gain * wet
    LOG.append({'t': round(t, 3), 'name': name, 'gain': round(gain, 3)})


def jit(v, amt):  # variación sutil
    return v * (1 + rng.uniform(-amt, amt))


# ───────────────────────── familias de sonido ─────────────────────────
def sweep_noise(dur, f0, f1, bw=1.0, curve=1.6):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    f, _, Z = signal.stft(noise, SR, nperseg=1024, noverlap=896)
    x = np.linspace(0, 1, Z.shape[1]) ** curve
    fc = np.exp(np.log(f0) + (np.log(f1) - np.log(f0)) * x)
    M = np.exp(-((np.log(np.maximum(f, 20))[:, None] - np.log(fc)[None, :]) / bw) ** 2)
    _, y = signal.istft(Z * M, SR, nperseg=1024, noverlap=896)
    y = y[:n]
    return np.pad(y, (0, max(0, n - len(y))))


def whoosh(t, dur, f0, f1, peak, gain, pan0=-0.3, pan1=0.3, name='whoosh', bw=0.9, air=0.3, wet=0.14):
    n = int(dur * SR)
    body = sweep_noise(dur, f0, f1, bw)
    top = sweep_noise(dur, f0 * 2.6, f1 * 2.6, bw * 0.9)
    s = body + air * top
    s = lowpass(s, 9500)
    s = highpass(s, 110)
    s = s * beta_env(n, peak)
    s = s / (np.abs(s).max() + 1e-9)
    p = np.linspace(pan0, pan1, n)
    ang = (p + 1) * math.pi / 4
    place_st(s * np.cos(ang), s * np.sin(ang), t, gain, wet, name)


def tick(t, freq, gain, pan=0.0, name='tick'):
    freq = jit(freq, 0.012)
    x = tt(0.09)
    s = np.sin(2 * math.pi * freq * x) * np.exp(-x / 0.016)
    s += 0.28 * np.sin(2 * math.pi * freq * 2.76 * x) * np.exp(-x / 0.007)
    click = highpass(rng.standard_normal(len(x)), 3500) * np.exp(-x / 0.0006) * 0.25
    s = att(s + click, 0.25)
    place(lowpass(s, 11000), t, jit(gain, 0.15), pan, 0.16, name)


def pop_tone(t, freq, gain, pan=0.0, name='pop'):
    freq = jit(freq, 0.008)
    x = tt(0.18)
    f = freq * (1 + 0.55 * np.exp(-x / 0.014))
    ph = 2 * math.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-x / 0.05)
    s += 0.18 * np.sin(2 * ph) * np.exp(-x / 0.025)
    s = att(s, 0.8)
    place(lowpass(s, 8000), t, jit(gain, 0.12), pan, 0.2, name)


def sub_hit(t, freq, gain, name='sub'):
    x = tt(0.7)
    f = freq + (freq * 1.1) * np.exp(-x / 0.045)
    ph = 2 * math.pi * np.cumsum(f) / SR
    s = 0.7 * np.sin(ph) * np.exp(-x / 0.16)
    s += 0.45 * np.sin(2 * math.pi * freq * 2.0 * x) * np.exp(-x / 0.07)
    s += 0.28 * np.sin(2 * math.pi * freq * 3.0 * x) * np.exp(-x / 0.045)
    nz = lowpass(rng.standard_normal(len(x)), 1800) * np.exp(-x / 0.018) * 0.25
    s = att(s + nz, 1.2)
    place(lowpass(s, 4200), t, jit(gain, 0.08), 0.0, 0.06, name)


def air_puff(t, gain, pan=0.0):
    whoosh(t, 0.2, 1800, 5200, 0.5, gain, pan, pan, 'air', 0.7, 0.4, 0.1)


def wood_tok(t, freq, gain, pan=0.0, name='tok'):
    freq = jit(freq, 0.03)
    x = tt(0.12)
    f = freq * (1 - 0.25 * (1 - np.exp(-x / 0.02)))
    ph = 2 * math.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-x / 0.03)
    s += 0.45 * np.sin(2 * math.pi * freq * 2.4 * x) * np.exp(-x / 0.012)
    nz = bandpass(rng.standard_normal(len(x)), 900, 3200) * np.exp(-x / 0.005) * 0.45
    s = att(s + nz, 0.4)
    place(lowpass(s, 7000), t, jit(gain, 0.15), pan, 0.1, name)


def coin_clink(t, base, gain, pan=0.0, weight=0.5, name='coin'):
    base = jit(base, 0.05)
    x = tt(0.35)
    parts = [(1.0, 1.0, 0.11), (2.41, 0.6, 0.07), (3.93, 0.4, 0.045), (6.12, 0.22, 0.025)]
    s = np.zeros(len(x))
    for r, a, tau in parts:
        s += a * np.sin(2 * math.pi * base * r * x + rng.uniform(0, 6.28)) * np.exp(-x / tau)
    nz = highpass(rng.standard_normal(len(x)), 4000) * np.exp(-x / 0.002) * 0.3
    body = np.sin(2 * math.pi * 190 * x) * np.exp(-x / 0.022) * weight
    s = att(s * 0.55 + nz + body, 0.3)
    place(lowpass(s, 12000), t, jit(gain, 0.15), pan, 0.14, name)


def pin_thock(t, note, gain, pan=0.0, name='pin'):
    x = tt(0.3)
    f = 150 + 120 * np.exp(-x / 0.03)
    ph = 2 * math.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-x / 0.045)
    nz = bandpass(rng.standard_normal(len(x)), 500, 2400) * np.exp(-x / 0.012) * 0.55
    ping = np.sin(2 * math.pi * note * 2 * x) * np.exp(-x / 0.1) * 0.2
    s = att(s + nz + ping, 0.5)
    place(lowpass(s, 9000), t, jit(gain, 0.1), pan, 0.14, name)


def paper_slide(t, dur, gain, pan0=-0.2, pan1=0.2, name='paper'):
    n = int(dur * SR)
    s = bandpass(rng.standard_normal(n), 1100, 6500)
    mod = lowpass(rng.standard_normal(n), 70)
    mod = 0.65 + 0.35 * mod / (np.abs(mod).max() + 1e-9)
    s = s * mod * beta_env(n, 0.35)
    s = s / (np.abs(s).max() + 1e-9)
    p = np.linspace(pan0, pan1, n)
    ang = (p + 1) * math.pi / 4
    place_st(s * np.cos(ang), s * np.sin(ang), t, gain, 0.08, name)


def water(t, dur, gain):
    n = int(dur * SR)
    s = lowpass(rng.standard_normal(n), 650, 3)
    lfo = 0.6 + 0.4 * np.sin(2 * math.pi * 0.9 * np.arange(n) / SR + 1.0)
    s = s * lfo * beta_env(n, 0.45)
    s = s / (np.abs(s).max() + 1e-9)
    place(s, t, gain, 0.0, 0.2, 'water')


def chime(t, f, gain, pan=0.0, dur=1.4, name='chime'):
    x = tt(dur)
    s = np.zeros(len(x))
    for r, a, tau in [(1, 1.0, 0.55), (2.0, 0.35, 0.28), (3.01, 0.16, 0.14), (4.17, 0.08, 0.08)]:
        s += a * np.sin(2 * math.pi * f * r * x) * np.exp(-x / tau)
    s = att(s, 2.0)
    place(lowpass(s, 9000), t, gain, pan, 0.3, name)


# ───────────────────────── calendario de escenas ─────────────────────────
START = dict(micro=0, ventas100=rf(2.8 * 30), pequena=rf(5.05 * 30), ventas1m=rf(7.35 * 30), barco=rf(8.8 * 30),
             globo=rf(10.55 * 30), pastel=rf(13.1 * 30), calendario=rf(16.25 * 30), ciclo=rf(20.65 * 30))
BOUNDS = [START[k] for k in ['ventas100', 'pequena', 'ventas1m', 'barco', 'globo', 'pastel', 'calendario', 'ciclo']]
LEAD = 0.12

_note = [0]


def next_note(step=1):
    _note[0] = (_note[0] + step) % len(PENT)
    return PENT[_note[0]]


def word_t(S, t, ord_=0):
    f = max(rf((t - LEAD) * FPS), S + 4 + ord_ * 3)
    return fr(f)


last_text = [-1.0]


def text_cue(S, t, ord_, kind):
    ts = word_t(S, t, ord_) + 0.07  # el texto ya es legible ~2 fotogramas después de arrancar el blur
    if ts - last_text[0] < 0.045:
        ts = last_text[0] + 0.045
    last_text[0] = ts
    if kind == 'big':
        sub_hit(ts - 0.01, 66, 0.22, 'big:sub')
        pop_tone(ts, next_note(2) * 0.5, 0.2, rng.uniform(-0.15, 0.15), 'big:tone')
        air_puff(ts - 0.05, 0.07, rng.uniform(-0.2, 0.2))
    elif kind == 'mid':
        sub_hit(ts - 0.01, 72, 0.10, 'mid:sub')
        pop_tone(ts, next_note(1) * 0.5, 0.15, rng.uniform(-0.15, 0.15), 'mid:tone')
    else:
        tick(ts, next_note(1) * 2, 0.085, rng.uniform(-0.25, 0.25), 'tick')


# ───────────────────────── transiciones ─────────────────────────
# salida (texto: B-7, gráfico: B-5, acelera con easeIn → pico en B-1) y entrada (gráfico B..B+11, easeOut)
for i, B in enumerate(BOUNDS):
    v = rng.uniform(0.9, 1.12)
    whoosh(fr(B - 10), 0.40, 520 * v, 3000 * v, 0.78, 0.50, -0.35, 0.35, f'trans:out{i}')
    whoosh(fr(B - 1), 0.40, 2800 * v, 480 * v, 0.28, 0.36, 0.3, -0.25, f'trans:in{i}')

# apertura desde negro (iris)
sub_hit(0.0, 60, 0.18, 'open:sub')
whoosh(0.0, 0.5, 320, 2600, 0.62, 0.34, -0.2, 0.2, 'open:whoosh')

# ───────────────────────── textos (misma regla que Reveal/Line) ─────────────────────────
S = START
TEXT = [
    # (escena, t voz, ord, tipo)
    (S['micro'], 0.0, 0, 'tick'), (S['micro'], 0.26, 0, 'big'), (S['micro'], 0.78, 0, 'tick'),
    (S['micro'], 1.18, 0, 'mid'), (S['micro'], 1.7, 2, 'mid'), (S['micro'], 1.9, 0, 'tick'),
    (S['ventas100'], 2.56, 0, 'tick'), (S['ventas100'], 3.3, 0, 'big'), (S['ventas100'], 3.7, 0, 'tick'),
    (S['pequena'], 5.08, 0, 'big'), (S['pequena'], 5.62, 0, 'tick'), (S['pequena'], 6.0, 0, 'mid'),
    (S['pequena'], 6.35, 2, 'mid'), (S['pequena'], 6.55, 0, 'tick'),
    (S['ventas1m'], 7.06, 0, 'tick'), (S['ventas1m'], 7.85, 0, 'big'),
    (S['barco'], 8.8, 0, 'tick'), (S['barco'], 9.38, 0, 'big'), (S['barco'], 9.92, 0, 'mid'),
    (S['globo'], 10.4, 0, 'tick'), (S['globo'], 11.66, 0, 'mid'), (S['globo'], 12.28, 0, 'big'),
    (S['pastel'], 12.88, 0, 'tick'), (S['pastel'], 13.7, 0, 'big'), (S['pastel'], 14.55, 0, 'tick'),
    (S['pastel'], 15.42, 0, 'big'),
    (S['calendario'], 16.0, 0, 'tick'), (S['calendario'], 16.46, 0, 'big'), (S['calendario'], 16.66, 0, 'mid'),
    (S['calendario'], 17.38, 0, 'tick'), (S['calendario'], 17.7, 0, 'mid'),
    (S['ciclo'], 20.5, 0, 'tick'), (S['ciclo'], 21.58, 0, 'big'), (S['ciclo'], 22.0, 0, 'tick'),
    (S['ciclo'], 22.6, 0, 'mid'), (S['ciclo'], 23.04, 0, 'big'),
]
for sc, t, o, k in sorted(TEXT, key=lambda e: word_t(e[0], e[1], e[2])):
    text_cue(sc, t, o, k)

# cambios de cifra del calendario (Swap): 6→3 y «en 6 meses»→«en 3 meses»
swap_a = rf(19.15 * FPS)
whoosh(fr(swap_a - 2), 0.26, 700, 2300, 0.5, 0.17, -0.1, 0.2, 'swap:top')
pop_tone(fr(rf(19.2 * FPS) + 4), 880, 0.17, 0.0, 'swap:digit')
sub_hit(fr(rf(19.2 * FPS) + 3), 70, 0.12, 'swap:digit:sub')
whoosh(fr(rf(19.55 * FPS) - 2), 0.22, 800, 2100, 0.5, 0.13, 0.1, -0.1, 'swap:bottom')
pop_tone(fr(rf(19.55 * FPS) + 4), 987.77, 0.13, 0.0, 'swap:bottom:tone')

# ───────────────────────── objetos ─────────────────────────
# Escena 1 · peones (el primero «tú» con pin; luego 8 más cuentan «1 a 9»)
t_you = fr(rf(0.35 * FPS) + 5)
wood_tok(t_you, 215, 0.34, 0.0, 'pawn:you')
pin_thock(t_you + 0.09, PENT[5], 0.22, 0.0, 'pin:you')
for k in range(1, 9):
    t0 = 1.0 + (k - 1) * 0.1
    tk = fr(rf(t0 * FPS) + 5)
    wood_tok(tk, 175 + k * 9, 0.22, (k % 3 - 1) * 0.28, f'pawn:{k}')

# Escena 2 · 8 monedas cayendo (el tono sube con la pila); la última lleva el $ naranja
for i in range(8):
    tk = fr(rf((2.9 + i * 0.1) * FPS) + 5)
    coin_clink(tk, 2300 + i * 150, 0.20 if i < 7 else 0.26, 0.0, 0.5 + i * 0.03, f'coin:{i}')
chime(fr(rf((2.9 + 7 * 0.1) * FPS) + 5) + 0.08, PENT[5], 0.11, 0.0, 1.2, 'coin:top:chime')

# Escena 3a · tarjeta + equipo (10 naranjas, 39 azules a modo de lluvia suave)
paper_slide(fr(S['pequena'] - 1), 0.34, 0.20, -0.1, 0.1, 'card:slide')
for i in range(10):
    tk = fr(rf((5.25 + i * 0.04) * FPS) + 4)
    pop_tone(tk, PENT[3 + (i % 4)], 0.10, (i / 9 - 0.5) * 0.5, 'person:orange')
rest = [rf((5.75 + ((i - 10) / 39) * 0.6) * FPS) + 4 for i in range(10, 49)]
for j, f in enumerate(rest):
    if j % 2 == 0:
        tick(fr(f), PENT[4 + (j % 5)] * 1.0, 0.05, rng.uniform(-0.4, 0.4), 'person:blue')
chime(fr(rest[-1]) + 0.05, PENT[5], 0.12, 0.0, 1.0, 'team:done')

# Escena 3b · torre de 54 monedas: ráfaga ascendente + remate
for k, i in enumerate(range(0, 54, 3)):
    tk = fr(rf((7.4 + (i / 54) * 0.6) * FPS) + 3)
    coin_clink(tk, 1500 + k * 120, 0.075 + k * 0.004, (k % 3 - 1) * 0.2, 0.2, 'tower')
for j in range(3):
    coin_clink(fr(rf((7.4 + j * 0.06) * FPS) + 3), 2100 + j * 140, 0.11, -0.45, 0.4, 'smallstack')
top_t = fr(rf((7.4 + (53 / 54) * 0.6) * FPS) + 3)
coin_clink(top_t + 0.03, 2800, 0.24, 0.0, 0.9, 'tower:top')
chime(top_t + 0.04, PENT[6], 0.13, 0.0, 1.3, 'tower:chime')

# Escena 4a · barco de papel
whoosh(fr(S['barco'] + 2), 0.55, 900, 380, 0.3, 0.2, -0.7, 0.0, 'boat:slide', 0.8, 0.2, 0.2)
water(fr(S['barco']), 1.6, 0.075)

# Escena 4b · globo: pin, 4 arcos con su punto de llegada


def bez(x1, y1, x2, y2):
    def f(t_):
        lo, hi = 0.0, 1.0
        for _ in range(40):
            m = (lo + hi) / 2
            xm = 3 * (1 - m) ** 2 * m * x1 + 3 * (1 - m) * m * m * x2 + m ** 3
            if xm < t_:
                lo = m
            else:
                hi = m
        m = (lo + hi) / 2
        return 3 * (1 - m) ** 2 * m * y1 + 3 * (1 - m) * m * m * y2 + m ** 3
    return f


easeIO = bez(0.65, 0, 0.35, 1)
pin_thock(fr(rf(10.8 * FPS) + 3), PENT[4], 0.22, 0.0, 'globe:pin')
a0 = rf(11.2 * FPS)
for i in range(4):
    # primer fotograma en que arcP*4 - i > 0
    target = i / 4
    f = next((k for k in range(0, 37) if easeIO(k / 36) * 4 - i > 0.02), 0)
    ta = fr(a0 + f)
    pan = [-0.3, 0.25, -0.15, 0.35][i]
    x = tt(0.22)
    sw = np.sin(2 * math.pi * np.cumsum(PENT[2] * (1 + 1.2 * x / 0.22 * (0.6 + 0.15 * i))) / SR) * np.exp(-x / 0.09)
    place(att(lowpass(sw, 7000), 0.6), ta, 0.11, pan, 0.2, 'arc:draw')
    pop_tone(ta + 0.17, PENT[3 + i], 0.15, pan, 'arc:end')

# Escena 5 · pastel: barrido del 25 %, deslizamiento de la porción y pin
whoosh(fr(rf(13.7 * FPS) - 1), 0.62, 650, 3400, 0.55, 0.26, -0.4, 0.4, 'pie:sweep')
tick(fr(rf(13.7 * FPS) + 29), PENT[7], 0.12, 0.2, 'pie:snap')
paper_slide(fr(rf(14.3 * FPS)), 0.22, 0.14, 0.0, 0.3, 'pie:pull')
sub_hit(fr(rf(14.3 * FPS) + 14), 74, 0.12, 'pie:pull:sub')
pin_thock(fr(rf(14.45 * FPS) + 5), PENT[5], 0.26, 0.2, 'pie:pin')

# Escena 6/7 · calendario: 12 fichas, 6 pins y retirada de 3
for i in range(12):
    tk = fr(max(rf(16.05 * FPS) + 2 * i + 6, S['calendario'] + 1))
    pop_tone(tk, PENT[(i * 2) % 5 + 1] * 0.5, 0.075, (i % 4 - 1.5) * 0.25, 'tile:tap')
for j in range(6):
    pt = rf((16.5 + j * 0.33) * FPS)
    pin_thock(fr(pt - 4), PENT[(j + 1) % 7], 0.24, (j % 3 - 1) * 0.2, f'cal:pin{j}')
for j in (0, 1, 5):
    tick(fr(swap_a + 2 * j + 3), PENT[3 - (j % 3)] * 0.5, 0.06, 0.0, 'cal:unpin')

# Escena 8 · anillo cíclico y cierre
chime(fr(rf(20.6 * FPS) + 8), PENT[4], 0.14, 0.0, 1.3, 'ring:in')
whoosh(fr(rf(20.6 * FPS)), 0.55, 350, 1600, 0.45, 0.14, -0.3, 0.3, 'ring:swell')
end_t = word_t(S['ciclo'], 23.04, 0) + 0.07
chime(end_t + 0.02, PENT[5], 0.20, -0.1, 1.5, 'final:chime1')
chime(end_t + 0.05, PENT[8], 0.12, 0.15, 1.5, 'final:chime2')

# ───────────────────────── reverb de sala pequeña + mezcla maestra ─────────────────────────


def make_ir(seed, length=0.9, tau=0.2):
    g = np.random.default_rng(seed)
    n = int(length * SR)
    x = np.arange(n) / SR
    ir = g.standard_normal(n) * np.exp(-x / tau)
    ir = lowpass(highpass(ir, 220), 6500)
    ir = np.concatenate([np.zeros(int(0.012 * SR)), ir])
    return ir / np.sqrt((ir ** 2).sum())


wet_l = signal.fftconvolve(send[0], make_ir(1))[:N]
wet_r = signal.fftconvolve(send[1], make_ir(2))[:N]
out = np.stack([dry_l + wet_l * 1.0, dry_r + wet_r * 1.0])
out = np.stack([highpass(out[0], 28, 2), highpass(out[1], 28, 2)])

# recorte exacto al video, sin fundido visual; micro-fundido de 120 ms para evitar un clic
n_end = int(round(T_END * SR))
out = out[:, :n_end]
fade = int(0.12 * SR)
out[:, -fade:] *= np.linspace(1, 0, fade)

# techo suave y normalización a -1.5 dBFS de pico
out = np.tanh(out * 1.15) / np.tanh(1.15)
pk = np.abs(out).max()
out = out / pk * (10 ** (-1.5 / 20))

here = os.path.dirname(os.path.abspath(__file__))
dst = os.path.join(here, '..', 'public', 'sfx.wav')
pcm = (out.T * 32767).astype(np.int16)
with wave.open(dst, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
json.dump(sorted(LOG, key=lambda e: e['t']), open(os.path.join(here, 'sfx_events.json'), 'w'), indent=1)
print('eventos:', len(LOG), ' duración:', round(n_end / SR, 3), 's  pico:', round(20 * math.log10(np.abs(out).max()), 2), 'dBFS')
