    var folderId = 'FOLDER_ID_GOES_HERE'; //Replace the folder id with the folder id of the parent folder in the Google Drive, where you would like to start sorting through the drive. 


// Main function 1: List all folders, & write into the current sheet.
function listFolders(){
  getFolderTree(folderId, false);
};

// Main function 2: List all files & folders, & write into the current sheet.
function listAll(){
  getFolderTree(folderId, true); 
};

// =================
// Get Folder Tree
function getFolderTree(folderId, listAll) {
  try {
    // Get folder by id
    var parentFolder = DriveApp.getFolderById(folderId);

    // Initialise the sheet
    var file, data, sheet = SpreadsheetApp.getActiveSheet();
    sheet.clear();
    sheet.appendRow(["Full Path", "Folder ID", "FileName"]);

    // Get files and folders
    getChildFolders(parentFolder.getName(), parentFolder, data, sheet, listAll);

  } catch (e) {
    Logger.log(e.toString());
  }
};

// Get the list of files and folders and their metadata in recursive mode
function getChildFolders(parentName, parent, data, sheet, listAll) {
  var childFolders = parent.getFolders();

  // List folders inside the folder
  while (childFolders.hasNext()) {
    var childFolder = childFolders.next();
    // Logger.log("Folder Name: " + childFolder.getName());
    data = [ 
      parentName + "/" + childFolder.getName(),
      childFolder.getId()


    ];
    // Write
    sheet.appendRow(data);

    // List files inside the folder
    var files = childFolder.getFiles();
    while (listAll & files.hasNext()) {
      var childFile = files.next();
      // Logger.log("File Name: " + childFile.getName());
      data = [ 
        parentName + "/" + childFolder.getName(),
        childFolder.getId(),
        childFile.getName(),
        childFile.getId()

      ];
      // Write
      sheet.appendRow(data);
    }

    // Recursive call of the subfolder
    getChildFolders(parentName + "/" + childFolder.getName(), childFolder, data, sheet, listAll);  
  }
};    
