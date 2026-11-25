# Mag rzucający kulą ognia

Animacja pixel-art zrobiona biblioteką [pixelfx](https://github.com/patch-gg/pixelfx) (MIT): szary czarodziej w spiczastym kapeluszu, z długą brodą i sękatym kosturem unosi kostur, na jego głowicy zbiera się ogień, po czym pchnięciem kostura ciska kulę ognia, która wybucha na celu.

- `mag-kula-ognia.gif` (50 kl./s), `mag-kula-ognia.mp4` (60 kl./s) – podgląd; ruch jest płynny, interpolowany co klatkę zamiast domyślnych w pixelfx skoków 12 kl./s
- `mag-kula-ognia.sheet.png` + `.sheet.json` – sprite sheet (223 klatki 388×260, 30 fps, JSON w stylu Aseprite: Phaser, Godot, Unity)
- `wizard-fireball.js` – źródło efektu; należy do `src/fx/moves/` w checkoutcie pixelfx

Ponowne renderowanie (w katalogu pixelfx):

```sh
cp wizard-fireball.js <pixelfx>/src/fx/moves/
node tools/act.mjs moves/wizard-fireball --mp4
node tools/act.mjs moves/wizard-fireball --sheet
```
