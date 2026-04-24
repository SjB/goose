# goose Desktop App

Native desktop app for goose built with [Electron](https://www.electronjs.org/) and [ReactJS](https://react.dev/). 

# Building and running
goose uses [Hermit](https://github.com/cashapp/hermit) to manage dependencies, so you will need to have it installed and activated.

```
git clone git@github.com:aaif-goose/goose.git
cd goose
source ./bin/activate-hermit
cd ui/desktop
pnpm install
pnpm run start
```

## Platform-specific build requirements

### Linux
For building on Linux distributions, you'll need additional system dependencies:

**Debian/Ubuntu:**
```bash
sudo apt install dpkg fakeroot libvulkan-dev glslc
```

**Arch/Manjaro:**
```bash
sudo pacman -S dpkg fakeroot vulkan-headers shaderc
```

**Fedora/RHEL:**
```bash
sudo dnf install dpkg-dev fakeroot vulkan-loader-devel shaderc
```

# Building notes

This is an electron forge app, using vite and react.js. `goosed` runs as multi process binaries on each window/tab similar to chrome.

## Building for different platforms

### macOS
`pnpm run bundle:default` will give you a goose.app/zip which is signed/notarized but only if you set up the env vars as per `forge.config.ts` (you can empty out the section on osxSign if you don't want to sign it) - this will have all defaults.

`pnpm run bundle:preconfigured` will make a goose.app/zip signed and notarized, but use the following:

```python
            f"        process.env.GOOSE_PROVIDER__TYPE = '{os.getenv("GOOSE_BUNDLE_TYPE")}';",
            f"        process.env.GOOSE_PROVIDER__HOST = '{os.getenv("GOOSE_BUNDLE_HOST")}';",
            f"        process.env.GOOSE_PROVIDER__MODEL = '{os.getenv("GOOSE_BUNDLE_MODEL")}';"
```

This allows you to set for example GOOSE_PROVIDER__TYPE to be "databricks" by default if you want (so when people start goose.app - they will get that out of the box). There is no way to set an api key in that bundling as that would be a terrible idea, so only use providers that can do oauth (like databricks can), otherwise stick to default goose.

### Linux
For Linux builds, first ensure you have the required system dependencies installed (see above), then:

1. Build the Rust backend:
```bash
cd ../..  # Go to project root
cargo build --release -p goose-server --features vulkan
```

2. Copy the server binary to the expected location:
```bash
mkdir -p src/bin
cp ../../target/release/goosed src/bin/
```

3. Build the application:
```bash
# For ZIP distribution (works on all Linux distributions)
pnpm run make --targets=@electron-forge/maker-zip

# For DEB package (Debian/Ubuntu)
pnpm run make --targets=@electron-forge/maker-deb

# For Flatpak (requires flatpak and flatpak-builder)
pnpm run make --targets=@electron-forge/maker-flatpak
```

The built application will be available in:
- ZIP: `out/make/zip/linux/x64/goose-linux-x64-{version}.zip`
- DEB: `out/make/deb/x64/goose_{version}_amd64.deb`
- Flatpak: `out/make/flatpak/x86_64/*.flatpak`
- Executable: `out/goose-linux-x64/goose`

The standard Linux build includes Vulkan local inference support. The packaged `.deb` and `.rpm` artifacts declare the Vulkan loader dependency, and building from source requires Vulkan development headers plus `glslc`.

### Windows
Use the existing Windows build process as documented. The standard Windows build includes Vulkan local inference support, and the CUDA Windows variant includes both CUDA and Vulkan support. Building Windows artifacts with local inference support requires the Vulkan SDK to be installed and `VULKAN_SDK` to be set.


# Running with goosed server from source

Set `VITE_START_EMBEDDED_SERVER=yes` to no in `.env`.
Run `cargo run -p goose-server` from parent dir.
`pnpm run start` will then run against this.
You can try server directly with `./test.sh`
