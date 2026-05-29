import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const stubDir = resolve(".test-build/node_modules/react-native");
mkdirSync(stubDir, { recursive: true });

writeFileSync(
  resolve(stubDir, "index.js"),
  `const React = require("react");

function nativeComponent(name) {
  return function NativeComponent(props) {
    return React.createElement(name, props, props && props.children);
  };
}

exports.Pressable = nativeComponent("Pressable");
exports.Text = nativeComponent("Text");
exports.TextInput = nativeComponent("TextInput");
exports.View = nativeComponent("View");
exports.SafeAreaView = nativeComponent("SafeAreaView");
exports.ScrollView = nativeComponent("ScrollView");
exports.StatusBar = nativeComponent("StatusBar");
exports.StyleSheet = { create: (styles) => styles };
`
);

const asyncStorageStubDir = resolve(".test-build/node_modules/@react-native-async-storage/async-storage");
mkdirSync(asyncStorageStubDir, { recursive: true });
writeFileSync(
  resolve(asyncStorageStubDir, "index.js"),
  `module.exports = {
  getItem: async () => null,
  setItem: async () => undefined,
  removeItem: async () => undefined
};
`
);

const urlPolyfillStubDir = resolve(".test-build/node_modules/react-native-url-polyfill");
mkdirSync(urlPolyfillStubDir, { recursive: true });
writeFileSync(resolve(urlPolyfillStubDir, "auto.js"), "");

const supabaseStubDir = resolve(".test-build/node_modules/@supabase/supabase-js");
mkdirSync(supabaseStubDir, { recursive: true });
writeFileSync(
  resolve(supabaseStubDir, "index.js"),
  `exports.createClient = function createClient() {
  return {
    from() {
      throw new Error("Supabase table access must be mocked in tests.");
    },
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signInWithPassword: async () => ({ data: { session: null }, error: null }),
      signUp: async () => ({ data: { user: null, session: null }, error: null }),
      signOut: async () => ({ error: null })
    }
  };
};
`
);
