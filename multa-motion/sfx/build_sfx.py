#!/usr/bin/env python3
"""
Diseño de sonido del motion «multa por activos del exterior» (síntesis, sin muestras externas ni música).

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
DURATION_F = 657
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


# ───────────────────────── calendario de escenas (replica src/theme.ts) ─────────────────────────
START = dict(declaracion=0, omision=rf(2.45 * 30), multa=rf(7.85 * 30), exterior=rf(11.75 * 30),
             noReportado=rf(15.15 * 30), tope=rf(16.75 * 30), salarios=rf(18.65 * 30))
BOUNDS = [START[k] for k in ['omision', 'multa', 'exterior', 'noReportado', 'tope', 'salarios']]
LEAD = 0.12
_note = [0]


def next_note(step=1):
    _note[0] = (_note[0] + step) % len(PENT)
    return PENT[_note[0]]


def word_t(S, t, ord_=0):
    return fr(max(rf((t - LEAD) * FPS), S + 4 + ord_ * 3))


last_text = [-1.0]


def text_cue(S, t, ord_, kind):
    ts = word_t(S, t, ord_) + 0.07
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


def scribble(t, gain, name='pen'):
    """Trazo suave de bolígrafo/lápiz sobre papel."""
    n = int(0.075 * SR)
    s = bandpass(rng.standard_normal(n), 2200, 7000)
    mod = 0.55 + 0.45 * np.sin(2 * math.pi * rng.uniform(55, 80) * np.arange(n) / SR)
    s = s * mod * beta_env(n, 0.4)
    s = s / (np.abs(s).max() + 1e-9)
    place(s, t, gain, rng.uniform(-0.25, 0.25), 0.08, name)


def thunk(t, gain, name='stamp'):
    """Sello contra el papel: golpe sordo + crujido corto."""
    x = tt(0.25)
    f = 120 + 90 * np.exp(-x / 0.025)
    ph = 2 * math.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-x / 0.06)
    nz = bandpass(rng.standard_normal(len(x)), 300, 2200) * np.exp(-x / 0.014) * 0.6
    s = att(s + nz, 0.4)
    place(lowpass(s, 6000), t, jit(gain, 0.08), 0.0, 0.1, name)


def swish(t, dur, gain, up=True, pan=0.0, name='swish'):
    whoosh(t, dur, 900 if up else 3200, 3200 if up else 900, 0.5, gain, pan - 0.15, pan + 0.15, name, 0.8, 0.2, 0.08)


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
S = START

# ───────────────────────── transiciones y apertura ─────────────────────────
for i, B in enumerate(BOUNDS):
    v = rng.uniform(0.9, 1.12)
    whoosh(fr(B - 10), 0.40, 520 * v, 3000 * v, 0.78, 0.50, -0.35, 0.35, f'trans:out{i}')
    whoosh(fr(B - 1), 0.40, 2800 * v, 480 * v, 0.28, 0.36, 0.3, -0.25, f'trans:in{i}')
sub_hit(0.0, 60, 0.18, 'open:sub')
whoosh(0.0, 0.5, 320, 2600, 0.62, 0.34, -0.2, 0.2, 'open:whoosh')

# ───────────────────────── textos (misma regla que Reveal/Line) ─────────────────────────
TEXT = [
    (S['declaracion'], 0.0, 0, 'tick'), (S['declaracion'], 0.3, 0, 'big'), (S['declaracion'], 0.58, 1, 'mid'),
    (S['declaracion'], 1.5, 1, 'big'),
    (S['omision'], 2.24, 0, 'tick'), (S['omision'], 3.88, 1, 'big'), (S['omision'], 4.46, 0, 'big'),
    (S['omision'], 5.36, 1, 'big'), (S['omision'], 6.84, 1, 'big'),
    (S['multa'], 7.66, 0, 'tick'), (S['multa'], 8.96, 0, 'big'), (S['multa'], 9.9, 0, 'tick'),
    (S['multa'], 10.62, 1, 'mid'),
    (S['exterior'], 11.32, 0, 'tick'), (S['exterior'], 13.4, 0, 'big'), (S['exterior'], 14.2, 1, 'big'),
    (S['noReportado'], 15.24, 0, 'big'), (S['noReportado'], 15.74, 0, 'big'),
    (S['tope'], 16.68, 0, 'tick'), (S['tope'], 17.48, 0, 'big'),
    (S['salarios'], 18.6, 0, 'big'), (S['salarios'], 19.82, 0, 'mid'), (S['salarios'], 21.2, 0, 'big'),
]
for sc, t, o, k in sorted(TEXT, key=lambda e: word_t(e[0], e[1], e[2])):
    text_cue(sc, t, o, k)

# ───────────────────────── 1 · documento en blanco que no entra en la bandeja ─────────────────────────
paper_slide(0.05, 0.36, 0.20, -0.1, 0.1, 'doc:slide')
thunk(fr(10 + 8), 0.14, 'tray:in')
swish(fr(rf(0.7 * FPS)), 0.22, 0.09, True, 0.0, 'arrow:draw')
whoosh(fr(rf(0.78 * FPS)), 0.28, 1500, 500, 0.4, 0.10, 0.0, 0.0, 'doc:push', 0.8, 0.2, 0.08)
fb = rf(1.15 * FPS) + 4
thunk(fr(fb), 0.26, 'forbid:hit')
sub_hit(fr(fb), 70, 0.14, 'forbid:sub')
pop_tone(fr(fb), PENT[3] * 0.5, 0.18, -0.1, 'forbid:tone1')
pop_tone(fr(fb) + 0.09, PENT[0] * 0.5, 0.17, 0.1, 'forbid:tone2')
wood_tok(fr(fb + 8), 190, 0.16, 0.0, 'doc:bounce')

# ───────────────────────── 2 · sello, tachados que cubren y se destapan ─────────────────────────
paper_slide(fr(S['omision'] - 1), 0.34, 0.20, -0.1, 0.1, 'doc2:slide')
for k in range(3):
    scribble(fr(S['omision'] + 8 + k * 6), 0.09, 'sign:pen')
thunk(fr(rf(2.92 * FPS) + 4), 0.30, 'stamp')
scribble(fr(rf(3.08 * FPS)) + 0.02, 0.12, 'check:pen')
pop_tone(fr(rf(3.08 * FPS) + 12), PENT[5], 0.16, 0.0, 'check:done')
for i in range(5):
    b0 = rf(3.85 * FPS) + i * 4
    swish(fr(b0), 0.14, 0.09, True, (i % 3 - 1) * 0.15, 'bar:swish')
    wood_tok(fr(b0 + 9), 120, 0.11, 0.0, 'bar:cover')
for k in range(2):
    swish(fr(rf(5.5 * FPS) + k * 6), 0.14, 0.08, False, 0.1, 'bar:reveal')
whoosh(fr(rf(6.65 * FPS)), 0.3, 700, 2600, 0.5, 0.13, -0.2, 0.2, 'bars:blue')
chime(fr(rf(6.65 * FPS) + 5), PENT[6], 0.12, 0.0, 1.1, 'bars:blue:chime')

# ───────────────────────── 3 · barra del valor total y lupa del 0,5 % ─────────────────────────
swish(fr(rf(8.0 * FPS)), 0.5, 0.13, True, 0.0, 'bar:grow')
whoosh(fr(rf(8.65 * FPS) - 1), 0.4, 600, 2200, 0.45, 0.15, -0.5, 0.0, 'lens:in', 0.9, 0.3, 0.2)
chime(fr(rf(8.65 * FPS) + 8), PENT[7], 0.09, -0.2, 0.9, 'lens:glass')
t0r = rf(8.95 * FPS)
for k in range(11):
    tick(fr(t0r + k), PENT[3 + (k // 3)] * (1.0 if k % 5 else 1.5), 0.04 + (0.03 if k % 5 == 0 else 0), (k / 10 - 0.5) * 0.4, 'lens:tick')
hi0 = rf(9.3 * FPS)
sub_hit(fr(hi0 + 2), 76, 0.2, 'fill:sub')
pop_tone(fr(hi0 + 3), PENT[6], 0.2, 0.0, 'fill:pop')
chime(fr(hi0 + 5), PENT[5], 0.15, 0.0, 1.4, 'fill:chime')
for j in range(2):
    tick(fr(hi0 + 4 + 42 * j + 10), PENT[8], 0.06, 0.0, 'lens:sonar')

# ───────────────────────── 4 · mapamundi: Ecuador y seis pines fuera ─────────────────────────
whoosh(fr(S['exterior'] + 2), 0.5, 900, 380, 0.3, 0.16, -0.4, 0.2, 'globe:in', 0.8, 0.2, 0.2)
pop_tone(fr(rf(12.0 * FPS) + 6), PENT[1] * 0.5, 0.15, 0.0, 'home:ping')
for j, t in enumerate([12.15, 12.45, 12.75, 13.05, 13.55, 13.95]):
    pin_thock(fr(rf(t * FPS) + 5), PENT[(j + 2) % 8], 0.24, (j % 3 - 1) * 0.25, 'globe:pin')

# ───────────────────────── 5 · el ojo y el tachado ─────────────────────────
o0 = S['noReportado']
whoosh(fr(o0 + 1), 0.4, 500, 1800, 0.5, 0.16, -0.3, 0.3, 'eye:open', 0.9, 0.3, 0.2)
pop_tone(fr(o0 + 9), PENT[2] * 0.5, 0.16, 0.0, 'eye:open:pop')
s0 = rf(15.8 * FPS)
swish(fr(s0 - 2), 0.18, 0.22, True, 0.0, 'slash:swish')
thunk(fr(s0 + 8), 0.30, 'slash:hit')
sub_hit(fr(s0 + 8), 62, 0.26, 'slash:sub')
chime(fr(s0 + 10), PENT[3], 0.1, 0.0, 1.0, 'slash:chime')

# ───────────────────────── 6 · la torre sube y choca con el techo ─────────────────────────
t0 = 16.95
NC = 36
for k, i in enumerate(range(0, NC - 1, 2)):
    tk = fr(rf((t0 + (i / NC) * 1.0) * FPS) + 3)
    coin_clink(tk, 1500 + k * 90, 0.07 + k * 0.004, (k % 3 - 1) * 0.2, 0.2, 'tower')
lastT = rf((t0 + ((NC - 1) / NC) * 1.0) * FPS)
hit = lastT + 3
sub_hit(fr(hit), 66, 0.2, 'ceiling:sub')
coin_clink(fr(hit), 2000, 0.2, 0.0, 0.9, 'ceiling:clank')
thunk(fr(hit), 0.14, 'ceiling:thunk')
for j in range(4):
    tick(fr(hit + 2 + 3 * j), PENT[4] * 1.5, 0.07 * (0.7 ** j), (j % 2 - 0.5) * 0.4, 'ceiling:rattle')
chime(fr(hit + 3), PENT[5], 0.16, 0.0, 1.3, 'ceiling:chime')

# ───────────────────────── 7 · cuenta 2.075 y pila de billetes ─────────────────────────
c0 = rf(18.72 * FPS)
vals = np.arange(1, 42) * 50
for j, v in enumerate(vals):
    frac = v / 2075
    # instante en que la animación (easeIO, 38 fotogramas) cruza ese valor
    f = next(k for k in range(0, 39) if easeIO(k / 38) >= frac)
    tick(fr(c0 + f), 330 + 900 * frac, 0.05 + 0.04 * frac, (j % 2 - 0.5) * 0.3, 'count:tick')
n0 = rf(18.78 * FPS)
for i in range(14):
    f = n0 + int(round(i * 2.4))
    paper_slide(fr(f), 0.10, 0.09, -0.2, 0.2, 'note:flap')
    wood_tok(fr(f + 3), 260, 0.08, rng.uniform(-0.2, 0.2), 'note:land')
chime(fr(c0 + 40), PENT[6], 0.15, 0.0, 1.3, 'count:done')
end_t = word_t(S['salarios'], 21.2, 0) + 0.07
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
out = np.tanh(out * 1.6) / np.tanh(1.6)
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
