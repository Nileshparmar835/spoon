import json,pathlib
N,C='host','crowd'
# (who, text, speed, pitch, gain, pause)
# Longer takes keep the voice flowing naturally. Pauses remain only where the story needs them.
def n(text,pause=.30): return (N,text,1.05,1.0,0,pause)
S=[
('hook',[n("This food cost nothing. And that's why people stopped thinking.")]),
('stall',[n("At M I T, researchers set up a chocolate stall.",.22)]),
('prices',[n("A fancy truffle, for fifteen cents. A plain little chocolate, for one cent.")]),
('smart',[n("Most buyers picked the truffle. Seventy-three percent. Smart choice.",.38)]),
('drop',[n("Then, both prices dropped by just one cent.",.30),n("Truffle: fourteen cents. Plain chocolate:",.24),n("free!",.14),(C,"Free?!",1.0,1.0,-1,.28)]),
('same',[n("The price gap? Exactly the same.",.34)]),
('flip',[n("But the crowd flipped! Sixty-nine percent took the free one.",.40)]),
('effect',[n("This is called the zero price effect. Free doesn't just feel cheap. It feels like you can't lose.",.42)]),
('shops',[n("That's why you see free delivery, if you spend a little more.",.24),n("Or a free gift, if you buy two.",.40)]),
('ask',[n("So the next time something is free, ask yourself:",.34),(N,"what is it really costing you?",.95,1.0,0,1.5)]),
]
rows=[dict(id=i,spoken=' '.join(p[1] for p in ps),parts=[dict(who=w,text=t,speed=s,pitch=pi,gain=g,pause=pa) for w,t,s,pi,g,pa in ps]) for i,ps in S]
pathlib.Path(__file__).with_name('script.json').write_text(json.dumps(rows,indent=1))
