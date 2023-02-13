// Get an error when trying to inject if we put this in deps/index.ts
// See: https://github.com/inversify/InversifyJS/issues/1179
export default {
  Config: Symbol.for("Config"),
  Redis: Symbol.for("Redis"),
  KoaServer: Symbol.for("KoaServer")
};