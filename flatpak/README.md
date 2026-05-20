# Flathub Packaging

This repository now includes the upstream files needed to package Goose for Flathub:

- `io.github.block.Goose.yaml`: Flatpak manifest for local validation
- `flatpak/io.github.block.Goose.desktop`: desktop entry
- `flatpak/io.github.block.Goose.metainfo.xml`: AppStream metadata
- `flatpak/goose-desktop.sh`: Flatpak launcher wrapper
- `flatpak/cargo-sources.json`: offline Cargo sources generated from `Cargo.lock`
- `flatpak/generated-sources.json`: offline pnpm sources generated from `ui/pnpm-lock.yaml`

## Local validation

Install the Flathub builder runtime if needed:

```bash
flatpak install -y flathub org.flatpak.Builder
```

Build and install the app from this checkout:

```bash
flatpak run --command=flathub-build org.flatpak.Builder --install io.github.block.Goose.yaml
flatpak run io.github.block.Goose
```

Run the linter:

```bash
flatpak run --command=flatpak-builder-lint org.flatpak.Builder manifest io.github.block.Goose.yaml
flatpak run --command=flatpak-builder-lint org.flatpak.Builder repo repo
```

Validate metadata directly:

```bash
appstreamcli validate flatpak/io.github.block.Goose.metainfo.xml
desktop-file-validate flatpak/io.github.block.Goose.desktop
```

## Important review notes

Goose is an upstream-submitted developer tool. The Flatpak manifest intentionally requests:

- `--filesystem=home`
- `--talk-name=org.freedesktop.Flatpak`

Those are needed because Goose runs against real project directories and, when sandboxed, uses `flatpak-spawn --host` for host shell execution. Flathub review will likely ask for justification for these permissions.

## Submission flow

1. Merge these upstream files.
2. Cut a new stable Goose release that includes them.
3. Fork `flathub/flathub` and create a branch from `new-pr`.
4. Copy these files into the Flathub submission branch:
   - `io.github.block.Goose.yaml`
   - `flatpak/cargo-sources.json`
   - `flatpak/generated-sources.json`
5. Open the PR against `new-pr` with title `Add io.github.block.Goose`.
6. Reply to reviewer questions, especially around sandbox permissions and Goose's Flatpak host-command model.

## Updating generated dependency manifests

Regenerate the offline manifests when `Cargo.lock` or `ui/pnpm-lock.yaml` changes.

Cargo:

```bash
PYTHONPATH="/tmp/opencode/flatpak-builder-tools-node-deps" \
python3 /tmp/opencode/flatpak-builder-tools/cargo/flatpak-cargo-generator.py \
  --git-tarballs \
  Cargo.lock -o flatpak/cargo-sources.json
```

pnpm:

```bash
PYTHONPATH="/tmp/opencode/flatpak-builder-tools/node:/tmp/opencode/flatpak-builder-tools-node-deps" \
python3 -m flatpak_node_generator pnpm ui/pnpm-lock.yaml -o flatpak/generated-sources.json
```
