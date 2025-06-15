
import React from "react";

const BrowserLogInstructions = () => (
  <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-blue-900 dark:text-blue-100">
    <h3 className="font-bold mb-1 text-blue-800 dark:text-blue-100">How to Copy Logs If You Have a Problem</h3>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Reload the page, then try creating or editing a report again.</li>
      <li>On your keyboard, press <b>F12</b> (or <b>Cmd + Option + J</b> on Mac) to open Developer Tools.</li>
      <li>Click the <b>Console</b> tab.</li>
      <li>If there’s an error, you’ll see a red message. <b>Right-click</b> it and choose <b>Copy</b>.</li>
      <li>Paste here (in chat/support) so we can help solve it!</li>
    </ol>
    <p className="mt-2 text-xs text-blue-700 dark:text-blue-200">
      Errors about saving reports will usually start with <b>Save Failed</b>, <b>Failed to Create</b>, or <b>Failed to Update</b>.
    </p>
  </div>
);

export default BrowserLogInstructions;
