let main = () => {
	let id = ScriptApp.getScriptId(),
		name = DriveApp.getFileById(id).getName(),
		target = getFolderContents(null, true),
		root = (target[name+'/'] ? target[name+'/'].id : DriveApp.getRootFolder().createFolder(name).getId()),
		orig = getFolderContents(DriveApp.getFileById(id).getParents().next().getId());
	target = getFolderContents(root);
	target = cloneTreeFolders(root, target, orig);
	target = cloneTreeFiles(root, target, orig);
	return { root, target, orig };
}
let cloneTreeFolders = (id, target, orig) => {
	for (let k in target) {
		if (target[k].children && !orig[k]) {
			DriveApp.getFolderById(target[k].id).setTrashed(true);
			delete target[k];
		}
	}
	for (let k in orig) {
		if (!orig[k].children)
			continue;
		if (!target[k])
			target[k] = {
				id: DriveApp.getFolderById(id).createFolder(k.slice(0, -1)).getId(),
				children: {}
			};
		target[k].children = cloneTreeFolders(target[k].id, target[k].children, orig[k].children);
	}
	return target;
}
let cloneTreeFiles = (id, target, orig) => {
	for (let k in target) {
		if (!orig[k]) {
			DriveApp.getFileById(target[k].id).setTrashed(true);
			delete target[k];
		}
	}
	for (let k in orig) {
		if (orig[k].id == ScriptApp.getScriptId())
			continue;
		if (!target[k])
			target[k] = {
				id: download(orig[k].id, id).getId(),
				time: new Date().getTime()
			};
		else if (orig[k].time > target[k].time) {
			DriveApp.getFileById(target[k].id).setTrashed(true);
			target[k] = {
				id: download(orig[k].id, id).getId(),
				time: new Date().getTime()
			};
		}else if (target[k].children)
			cloneTreeFiles(target[k].id, target[k].children, orig[k].children);
	}
	return target;
}
let download = (fileId, folderId) => {
  return DriveApp.getFileById(fileId.replace(/(?:.*)\/d\/(.*)\/view(?:.*)/, '$1')).makeCopy(
	  DriveApp.getFolderById((folderId || DriveApp.getFileById(ScriptApp.getScriptId()).getParents().next().getId()))
  );
}
let getFolderContents = (folderId, no_child) => {
	let contents = {},
		topFolder = (folderId ? DriveApp.getFolderById(folderId) : DriveApp.getRootFolder()),
		files = topFolder.getFiles(),
		folders = topFolder.getFolders();
	while (files.hasNext()) {
		let file = files.next();
		contents[file.getName()] = {
			id: file.getId(),
			time: new Date(file.getLastUpdated()).getTime()
		};
	}
	while (folders.hasNext()) {
		let folder = folders.next(),
			id = folder.getId();
		contents[folder.getName()+'/'] = {
			id: id,
			children: (!no_child && getFolderContents(id))
		};
	}
	return contents;
}
this.googleCloneDrive = main;
this.googleCloneDrive.download = download;
this.googleCloneDrive.getFolderContents = getFolderContents;
