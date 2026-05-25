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
