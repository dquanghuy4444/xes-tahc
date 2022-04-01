const buildFileSelector = (callback, isMultiple = true, acceptType = "image/*") => {
    const fileSelector = document.createElement("input")
    fileSelector.setAttribute("type", "file")

    if (isMultiple){
        fileSelector.setAttribute("multiple", "multiple")
    }

    fileSelector.setAttribute("accept", acceptType)

    fileSelector.addEventListener("change", async(e) => {
        const fileList = e.target.files

        await callback([...fileList])
    })

    return fileSelector
}

export default buildFileSelector
