function onOpen() {
  var menuItems = [
    {name: 'Add a month', functionName: 'showPrompt'}
  ];
  SpreadsheetApp.getActiveSpreadsheet().addMenu('ToolBox', menuItems);
}

function showPrompt() {
  var ui = SpreadsheetApp.getUi()
  var result = ui.prompt(
    'What\'s the new month?',
    ui.ButtonSet.OK_CANCEL);
  
  var button = result.getSelectedButton();
  var text = result.getResponseText();
  
  if (button == ui.Button.OK) {
    createNewMonth(text);
  } else if (button == ui.Button.CANCEL) {
    ui.alert('I didn\'t get a month');
  } else if (button == ui.Button.CLOSE) {
    ui.alert('You closed the dialog.');
  }
}

function createNewMonth(text) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  ss.setActiveSheet(ss.getSheetByName("Template")); 
  
  if (ss != null) {
    var newsheet = ss.duplicateActiveSheet();
    newsheet.setName(text);
    ss.setActiveSheet(newsheet);
    ss.moveActiveSheet(2);
 } 
  
  updateBudgetRollUp(text);
}

function updateBudgetRollUp(text) {
  var text = '4/2016';  
  var rollUpSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Budget Rollup");
  
  rollUpSheet.insertColumnsAfter(2, 2);
  sourceRange = rollUpSheet.getRange("E1:F26");
  copyRange = rollUpSheet.getRange("C1:D26");
  
  sourceRange.copyTo(copyRange);
  rollUpSheet.getRange("C1").setValue(text);
  
  updateRange = rollUpSheet.getRange("C2:C22");
  values = updateRange.getFormulas();
  
  for (var row in values) {
    var val = values[row][0];
    
    if(val) {
      Logger.log(row+2);
      values[row][0] = "'" + text + "'" + "!" + "H" + (parseInt(row)+2);      
    }
  }
  
  updateRange.setFormulas(values);
}
