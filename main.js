// Global variables which will be used by multiple functions
var timestamp = new Date();
var good_sheets = ['Master_Copy', 'README!'];
var ss = SpreadsheetApp.getActiveSpreadsheet();
var master_sheet = ss.getSheetByName('Master_Copy');
var example_sheets = []

// Returns date formatted to DD/MM/YYYY
// As well as information about the timestamp
function formattedTimestamp(timestamp_to_check) {

  let formatted_date = timestamp_to_check.getDate().toString().padStart(2,'0');
  let formatted_month = (timestamp_to_check.getMonth() + 1).toString().padStart(2,'0'); //accounting for how js returns months indexing from 0-11
  let formatted_year = timestamp_to_check.getFullYear().toString().slice(-2);

  let formattedTS = ''.concat(formatted_date, "/", formatted_month, "/", formatted_year);

  return formattedTS;

}

//Returns day of week as number from 0-6, 0 being Sunday and 6 being Saturday
function checkDay(timestamp_to_check) {
  let day = timestamp.getDay();
  return day;
}

function goodSheetsGenerator(timestamp_to_check){

  switch(timestamp_to_check.getDay()) {

    case 0: // Sunday (Take Current Wed, Current Thur and Current Fri) Entry is only added to Master_Copy but not copied to any other sheet

      timestamp_to_check.setDate(timestamp_to_check.getDate() - 2); // Current Fri
      nTimestamp1 = formattedTimestamp(timestamp_to_check);
      Logger.log(''.concat('new timestamp 1: ', nTimestamp1));
      good_sheets.push(nTimestamp1);

      timestamp_to_check.setDate(timestamp_to_check.getDate() - 1); // Current Thur
      nTimestamp2 = formattedTimestamp(timestamp_to_check);
      Logger.log(''.concat('new timestamp 2: ', nTimestamp2));
      good_sheets.push(nTimestamp2);

      timestamp_to_check.setDate(timestamp_to_check.getDate() - 1); // Current Wed
      nTimestamp3 = formattedTimestamp(timestamp_to_check);
      Logger.log(''.concat('new timestamp 3: ', nTimestamp3));
      good_sheets.push(nTimestamp3);
      break;
    case 6: // Saturday (As Above)

      timestamp_to_check.setDate(timestamp_to_check.getDate() - 1); // Current Fri
      nTimestamp1 = formattedTimestamp(timestamp_to_check);
      Logger.log(''.concat('new timestamp 1: ', nTimestamp1));
      good_sheets.push(nTimestamp1);

      timestamp_to_check.setDate(timestamp_to_check.getDate() - 1); // Current Thur
      nTimestamp2 = formattedTimestamp(timestamp_to_check);
      Logger.log(''.concat('new timestamp 2: ', nTimestamp2));
      good_sheets.push(nTimestamp2);

      timestamp_to_check.setDate(timestamp_to_check.getDate() - 1); // Current Wed
      nTimestamp3 = formattedTimestamp(timestamp_to_check);
      Logger.log(''.concat('new timestamp 3: ', nTimestamp3));
      good_sheets.push(nTimestamp3);
      break;


    case 1: //Monday (Take Current Mon, Prev Thur and Prev Fri) Entry to be added to sheet with the same date

      good_sheets.push(formattedTimestamp(timestamp)); // Current Mon
      var sheet_to_update = formattedTimestamp(timestamp);
      createAndOrAppend(sheet_to_update); // copy new entry over

      timestamp_to_check.setDate(timestamp_to_check.getDate() - 3); // Prev Fri
      nTimestamp1 = formattedTimestamp(timestamp_to_check);
      Logger.log(''.concat('new timestamp 1: ', nTimestamp1));
      good_sheets.push(nTimestamp1);

      timestamp_to_check.setDate(timestamp_to_check.getDate() - 1); // Prev Thur
      nTimestamp2 = formattedTimestamp(timestamp_to_check);
      Logger.log(''.concat('new timestamp 2: ', nTimestamp2));
      good_sheets.push(nTimestamp2);
      break;


    case 2: // Tuesday (Take Current Tue, Current Mon, and Prev Fri) Entry to be added to sheet with the same date

      good_sheets.push(formattedTimestamp(timestamp)); // Current Tue
      var sheet_to_update = formattedTimestamp(timestamp);
      createAndOrAppend(sheet_to_update); // copy new entry over

      timestamp_to_check.setDate(timestamp_to_check.getDate() - 1); // Current Mon
      nTimestamp1 = formattedTimestamp(timestamp_to_check);
      Logger.log(''.concat('new timestamp 1: ', nTimestamp1));
      good_sheets.push(nTimestamp1);

      timestamp_to_check.setDate(timestamp_to_check.getDate() - 3); // Prev Fri
      nTimestamp2 = formattedTimestamp(timestamp_to_check);
      Logger.log(''.concat('new timestamp 2: ', nTimestamp2));
      good_sheets.push(nTimestamp2);
      break;


    case 3: // Wed
    case 4: // Thur
    case 5: // Fri

      good_sheets.push(formattedTimestamp(timestamp)); // Current Day
      var sheet_to_update = formattedTimestamp(timestamp);
      createAndOrAppend(sheet_to_update); // copy new entry over

      timestamp_to_check.setDate(timestamp_to_check.getDate() - 1); // Prev Day
      nTimestamp1 = formattedTimestamp(timestamp_to_check);
      Logger.log(''.concat('new timestamp 1: ', nTimestamp1));
      good_sheets.push(nTimestamp1);

      timestamp_to_check.setDate(timestamp_to_check.getDate() - 1); // Prev Day
      nTimestamp2 = formattedTimestamp(timestamp_to_check);
      Logger.log(''.concat('new timestamp 2: ', nTimestamp2));
      good_sheets.push(nTimestamp2);
      break;

  }
  Logger.log(''.concat('good sheets: ', good_sheets));

}

function createAndOrAppend(sheetname) {
  var sheet = ss.getSheetByName(sheetname);
  if (!sheet) {
    let headers = master_sheet.getRange(1,1,1,master_sheet.getLastColumn());
    headers.copyTo(ss.insertSheet(sheetname).getRange(1,1));

    sheet = ss.getSheetByName(sheetname);
    let newentry = master_sheet.getRange(master_sheet.getLastRow(),1,1, master_sheet.getLastColumn());
    newentry.copyTo(sheet.getRange(sheet.getLastRow() + 1,1));
   
  } else {
    sheet = ss.getSheetByName(sheetname);
    let newentry = master_sheet.getRange(master_sheet.getLastRow(),1,1, master_sheet.getLastColumn());
    newentry.copyTo(sheet.getRange(sheet.getLastRow() + 1,1));

  }
}

function allSheetNames() {
  var allnames = [];
  for (let i = 0; i < ss.getSheets().length; i++) {
    allnames.push(ss.getSheets()[i].getName());
  }
Logger.log(''.concat('Current Array of All Sheet Names: ', allnames));
return allnames;
}

function dataDeleter(array_to_keep, array_to_eval) {
  for (let i = 0; i < array_to_eval.length; i++) {
    if (array_to_keep.includes(array_to_eval[i])) {
      continue
    } else {
      let sheet_to_delete = ss.getSheetByName(array_to_eval[i]);
      ss.deleteSheet(sheet_to_delete);
    }
  }
}

function addExampleSheets() {
  current_timestamp = new Date()
  current_timestamp.setDate(current_timestamp.getDate() - 3); // 3 Days Before Current
      nTimestamp1 = formattedTimestamp(current_timestamp);

      Logger.log(''.concat('example timestamp 1: ', nTimestamp1));
      example_sheets.push(nTimestamp1);

  current_timestamp.setDate(current_timestamp.getDate() + 1); // 2 Days Before Current
      nTimestamp2 = formattedTimestamp(current_timestamp);
      Logger.log(''.concat('example timestamp 2: ', nTimestamp2));
      example_sheets.push(nTimestamp2);

  current_timestamp.setDate(current_timestamp.getDate() + 1); // 1 Day Before Current
      nTimestamp3 = formattedTimestamp(current_timestamp);
      Logger.log(''.concat('example timestamp 3: ', nTimestamp3));
      example_sheets.push(nTimestamp3);

  current_timestamp.setDate(current_timestamp.getDate() + 2); // 1 Day After Current
      nTimestamp4 = formattedTimestamp(current_timestamp);
      Logger.log(''.concat('example timestamp 4: ', nTimestamp4));
      example_sheets.push(nTimestamp4);

  current_timestamp.setDate(current_timestamp.getDate() + 1); // 2 Days After Current
      nTimestamp5 = formattedTimestamp(current_timestamp);
      Logger.log(''.concat('example timestamp 5: ', nTimestamp5));
      example_sheets.push(nTimestamp5);
 
  for (let i = 0; i < example_sheets.length; i++) {
    if (ss.getSheetByName(example_sheets[i])) {
      continue
    } else {
      let headers = master_sheet.getRange(1,1,1,master_sheet.getLastColumn());
      headers.copyTo(ss.insertSheet(example_sheets[i]).getRange(1,1));
    }
  }
  ss.getSheetByName('Master_Copy').activate();
}

function main(e) {
  ss.getSheetByName('Master_Copy').activate();
  formattedTimestamp(timestamp);
  checkDay(timestamp);
  goodSheetsGenerator(timestamp);
  dataDeleter(good_sheets,allSheetNames());
  allSheetNames();
}

function autoClear() {
  main();
  for (let i = master_sheet.getLastRow(); i > 1; i--) {
    master_sheet.deleteRow(i);
  }
  Logger.log('Auto cleared forms');
}
