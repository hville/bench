// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    /* ... */
  },
  plugins: [
    /* ... */
  ],
  packageOptions: {
		source: "remote", //imports from https://pkg.snowpack.dev
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
	},
	alias: {
    // Type 1: Package Import Alias
    //"lodash": "lodash-es",
    //"react": "preact/compat",
    // Type 2: Local Directory Import Alias (relative to cwd)
    //"components": "./src/components",
    //"@app": "./src"
  }
}
