// ====== Config ======
const SPREADSHEET_ID = 'PUT_YOUR_SPREADSHEET_ID_HERE';

// ====== Entry points ======
function doGet(e) {
  try {
    const action = (e.parameter.action || '').trim();

    let data;
    if (action === 'getExpenses') {
      const month = e.parameter.month;
      if (!month) throw new Error('Missing month (YYYY-MM)');
      data = getExpenses(month);
    } else if (action === 'getSummary') {
      const month = e.parameter.month;
      if (!month) throw new Error('Missing month (YYYY-MM)');
      data = getSummary(month);
    } else {
      throw new Error('Unknown or missing action');
    }

    return jsonResponse({ success: true, data });
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    const params = parseBody(e);
    const action = (params.action || '').trim();

    let data;
    if (action === 'addExpense') {
      data = addExpense(params);
    } else if (action === 'updateExpense') {
      data = updateExpense(params);
    } else if (action === 'deleteExpense') {
      data = deleteExpense(params);
    } else {
      throw new Error('Unknown or missing action');
    }

    return jsonResponse({ success: true, data });
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) });
  }
}

// ====== Helpers: HTTP & parsing ======
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseBody(e) {
  if (e.postData && e.postData.type === 'application/json') {
    return JSON.parse(e.postData.contents || '{}');
  }
  return e.parameter || {};
}

// ====== Sheets helpers ======
function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getOrCreateMonthSheet(month) {
  const ss = getSpreadsheet();
  const name = month;
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange('A1:H1').setValues([[
      'ID',
      'Date',
      'Item',
      'Amount',
      'Category',
      'PaymentMethod',
      'PaidBy',
      'CreatedAt'
    ]]);
  }
  return sheet;
}

function sheetToExpenseObjects(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const values = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
  return values.map(function (row) {
    return {
      id: String(row[0] || ''),
      date: String(row[1] || ''),
      item: String(row[2] || ''),
      amount: Number(row[3] || 0),
      category: String(row[4] || ''),
      paymentMethod: String(row[5] || ''),
      paidBy: String(row[6] || ''),
      createdAt: String(row[7] || '')
    };
  });
}

function findRowIndexById(sheet, id) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === id) {
      return 2 + i;
    }
  }
  return null;
}

// ====== Controllers: Expenses ======
function addExpense(params) {
  var id = params.id;
  var date = params.date;
  var item = params.item;
  var amount = Number(params.amount);
  var category = params.category;
  var paymentMethod = params.paymentMethod;
  var paidBy = params.paidBy;
  var createdAt = params.createdAt;

  if (!id || !date || !item || !amount || !category || !paymentMethod || !paidBy) {
    throw new Error('Missing required fields');
  }

  var month = (date || '').slice(0, 7);
  if (!month) throw new Error('Invalid date');

  var sheet = getOrCreateMonthSheet(month);
  var row = [[
    id,
    date,
    item,
    amount,
    category,
    paymentMethod,
    paidBy,
    createdAt || new Date().toISOString()
  ]];

  sheet.appendRow(row[0]);
  return { id: id };
}

function getExpenses(month) {
  var sheet = getOrCreateMonthSheet(month);
  var expenses = sheetToExpenseObjects(sheet);
  return { month: month, expenses: expenses };
}

function updateExpense(params) {
  var id = params.id;
  if (!id) throw new Error('Missing id');

  var month = params.month;
  if (!month && params.date) {
    month = String(params.date).slice(0, 7);
  }
  if (!month) throw new Error('Missing month');

  var sheet = getOrCreateMonthSheet(month);
  var rowIndex = findRowIndexById(sheet, id);
  if (!rowIndex) {
    throw new Error('Expense not found');
  }

  var date = params.date;
  var item = params.item;
  var amount = Number(params.amount);
  var category = params.category;
  var paymentMethod = params.paymentMethod;
  var paidBy = params.paidBy;
  var createdAt = params.createdAt;

  var row = [
    id,
    date,
    item,
    amount,
    category,
    paymentMethod,
    paidBy,
    createdAt || new Date().toISOString()
  ];

  sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  return { id: id };
}

function deleteExpense(params) {
  var id = params.id;
  var month = params.month;
  if (!id) throw new Error('Missing id');

  var ss = getSpreadsheet();
  var deleted = false;

  // First try the provided month sheet if any
  if (month) {
    var sheet = ss.getSheetByName(month);
    if (sheet) {
      var rowIndex = findRowIndexById(sheet, id);
      if (rowIndex) {
        sheet.deleteRow(rowIndex);
        deleted = true;
      }
    }
  }

  // If not deleted yet, search all sheets for this ID
  if (!deleted) {
    var sheets = ss.getSheets();
    for (var i = 0; i < sheets.length; i++) {
      var s = sheets[i];
      var r = findRowIndexById(s, id);
      if (r) {
        s.deleteRow(r);
        deleted = true;
        break;
      }
    }
  }

  return { id: id, deleted: deleted };
}

// ====== Controllers: Summary ======
function getSummary(month) {
  var sheet = getOrCreateMonthSheet(month);
  var expenses = sheetToExpenseObjects(sheet);

  var total = 0;
  var perPaidBy = { Ibu: 0, Rosita: 0, Aryo: 0, Shafa: 0, Together: 0 };
  var perCategory = {
    Food: 0,
    Transport: 0,
    Groceries: 0,
    Utilities: 0,
    Health: 0,
    Entertainment: 0,
    Shopping: 0,
    Education: 0,
    Others: 0
  };

  expenses.forEach(function (exp) {
    var amt = Number(exp.amount) || 0;
    total += amt;

    if (perPaidBy.hasOwnProperty(exp.paidBy)) {
      perPaidBy[exp.paidBy] += amt;
    }

    if (perCategory.hasOwnProperty(exp.category)) {
      perCategory[exp.category] += amt;
    } else {
      perCategory.Others += amt;
    }
  });

  return {
    month: month,
    total: total,
    perPaidBy: perPaidBy,
    perCategory: perCategory
  };
}

