# Bundled fonts

Both families are licensed under the SIL Open Font License 1.1, which permits
redistribution as part of this project.

| Family               | Files                             | Source                                                     |
| -------------------- | --------------------------------- | ---------------------------------------------------------- |
| DM Sans (variable)   | `dm-sans-latin*.woff2`            | https://fonts.google.com/specimen/DM+Sans — OFL 1.1        |
| JetBrains Mono (700) | `jetbrains-mono-700-latin*.woff2` | https://fonts.google.com/specimen/JetBrains+Mono — OFL 1.1 |

Only the `latin` and `latin-ext` subsets are bundled. `latin-ext` is required:
Turkish needs ğ, Ğ, ı, İ, ş and Ş, which fall outside the `latin` subset.

DM Sans ships as a single variable file per subset covering weights 100–1000, so
the 400 and 600 downloads are the same bytes and only one copy is stored.
