import path from "path"

let opfs: FileSystemDirectoryHandle 

async function getOPFSHandle(): Promise<FileSystemDirectoryHandle> {
 if (opfs == undefined || opfs == null) {
    opfs = await navigator.storage.getDirectory()
 } 
 return opfs
}

export async function createFile(name: string, content: any): Promise<FileSystemFileHandle> {
    if (name.length < 1) {
       throw(`file name can't be empty`) 
    }
    const opfs = await getOPFSHandle()
    const paths = name.split("/")
    let parent_directory_path: string
    let filepath: string

    if (paths.length < 2) {
        filepath = paths[0]
        parent_directory_path = ""
    } else {
        filepath = paths[paths.length-1]
        parent_directory_path = paths.slice(0, -1).join("/")
    }
    const parent_directory_handle = await createDirectory(parent_directory_path)
    const fileHandle = await parent_directory_handle.getFileHandle(filepath, { create:true })
    const writeStream = await fileHandle.createWritable()
    await writeStream.write(content)
    await writeStream.close()
    return fileHandle
}


export async function getFile(name: string): Promise<null|FileSystemFileHandle> {
    if (name.length < 1) {
       throw(`file name can't be empty`) 
    }
    // console.log(name)
    const opfs = await getOPFSHandle()
    const path_hierarchy = name.split("/")
    let rootEntry: FileSystemHandle = opfs
    for (const subpath of path_hierarchy) {
        let matched = false
        //@ts-ignore
        for await (let[name, handle]  of rootEntry.entries()) {
            if (name === subpath) {
                rootEntry = handle
                matched = true
                break
            }
        }
        if (!matched) {
            return null
        }
    }
    return rootEntry as FileSystemFileHandle

}

export async function createDirectory(name: string) {
    if (name.length < 1) {
       throw(`directory name can't be empty`) 
    }
    const opfs = await getOPFSHandle()
    const path_hierarchy = name.split("/")
    let directory  = opfs
    for (const subpath of path_hierarchy) {
        directory = await directory.getDirectoryHandle(subpath, {create: true})
    }
    return directory
}


export async function listAllFiles(name:string):Promise<string[]>{
    const opfs = await getOPFSHandle()
    const files: string[] = []
    const directory_handler = await opfs.getDirectoryHandle(name)
    //@ts-ignore
    for await (let [name, handle] of directory_handler) {
        files.push(name)
    }
    return files
}