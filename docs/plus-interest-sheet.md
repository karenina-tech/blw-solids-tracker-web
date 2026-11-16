# Save Plus sign-ups in a Google Sheet

The "Join the Plus list" form can write each sign-up as one row in a Google Sheet.
It uses a small script (Apps Script) attached to the sheet. No Google Cloud project or key file is needed.
This takes about 5 minutes.

## 1. Make the sheet

1. Create a new Google Sheet, for example "BLW Plus interest".
2. In row 1, write these headers, one per column (A to F):
   `When`, `Email`, `Plan`, `Language`, `Would like to track`, `Note`

## 2. Add the script

1. In the sheet, open **Extensions > Apps Script**.
2. Delete the code that is there and paste this:

```js
// Receives one sign-up from the website and adds a row. Needs a script property called SECRET.
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var data = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty('SECRET');
    if (!secret || data.secret !== secret) return reply_({ ok: false, error: 'unauthorized' });

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var email = String(data.email || '').toLowerCase();
    if (!email) return reply_({ ok: false, error: 'no email' });

    // The same email twice only adds a note, not a new row.
    var last = sheet.getLastRow();
    if (last > 1) {
      var emails = sheet.getRange(2, 2, last - 1, 1).getValues();
      for (var i = 0; i < emails.length; i++) {
        if (String(emails[i][0]).toLowerCase() === email) {
          sheet.getRange(i + 2, 6).setValue('Signed up again ' + String(data.when || ''));
          return reply_({ ok: true });
        }
      }
    }

    sheet.appendRow([
      String(data.when || ''),
      email,
      String(data.plan || ''),
      String(data.locale || ''),
      String(data.wish || ''),
      ''
    ]);
    return reply_({ ok: true });
  } catch (err) {
    return reply_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
```

3. Make a secret password. It can be any long random text (30 or more letters and numbers).
4. In the Apps Script editor, open **Project Settings** (the gear icon), go to **Script Properties**,
   and add a property named `SECRET` with your secret as the value. Save.

## 3. Publish it

1. Click **Deploy > New deployment**. Choose the type **Web app**.
2. Set **Execute as: Me** and **Who has access: Anyone**.
3. Click **Deploy** and allow the permissions Google asks for.
4. Copy the **Web app URL**. It ends with `/exec`.

"Anyone" only means the address can be called. Nothing is added without your secret.

## 4. Tell the website

In Vercel, in the BLW project, open **Settings > Environment Variables** and add:

| Name | Value |
|---|---|
| `PLUS_INTEREST_SHEET_URL` | the Web app URL |
| `PLUS_INTEREST_SHEET_SECRET` | the same secret as in step 2 |

Add them for Preview first (the staging site), test, then for Production.
Redeploy so the new values are used.

## 5. Test it

Fill in the form on the staging site. A new row should appear in the sheet within a few seconds.
Try the same email twice: the second time it adds a note in column F and no new row.

## Good to know

- If the sheet settings are set, sign-ups go only to the sheet. If they are not set, the site falls back to
  email (`RESEND_API_KEY` and `PLUS_INTEREST_TO`).
- Text that starts with `=`, `+`, `-` or `@` gets an apostrophe in front, so nobody can sneak a formula into your sheet.
- If you change the script later, use **Deploy > Manage deployments > Edit > New version**. The address stays the same.
- To rotate the secret, change it in Script Properties and in Vercel, then redeploy.
- To delete a parent's data, delete their row.
- Keep the sheet private. It holds parents' email addresses.
