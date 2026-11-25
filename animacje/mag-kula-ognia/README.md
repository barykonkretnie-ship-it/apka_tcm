# Mag rzucający kulą ognia

Animacja pixel-art zrobiona biblioteką [pixelfx](https://github.com/patch-gg/pixelfx) (MIT): szary czarodziej w spiczastym kapeluszu, z długą brodą i sękatym kosturem unosi kostur, na jego głowicy zbiera się ogień, po czym pchnięciem kostura ciska kulę ognia, która wybucha na celu.

- `mag-kula-ognia.gif`, `mag-kula-ognia.mp4` – podgląd (7,7 s)
- `mag-kula-ognia.sheet.png` + `.sheet.json` – sprite sheet (224 klatki 388×260, 30 fps, JSON w stylu Aseprite: Phaser, Godot, Unity)
- `wizard-fireball.js` – źródło efektu; należy do `src/fx/moves/` w checkoutcie pixelfx

Ponowne renderowanie (w katalogu pixelfx):

```sh
cp wizard-fireball.js <pixelfx>/src/fx/moves/
node tools/act.mjs moves/wizard-fireball --mp4
node tools/act.mjs moves/wizard-fireball --sheet
```
