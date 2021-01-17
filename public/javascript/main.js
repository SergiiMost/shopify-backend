const UI = (() => {
  const helperGetCheckboxes = () => {
    let checkboxes = document.querySelectorAll('.imageCheckbox')
    const checked = Array.from(checkboxes).filter((checkbox) => checkbox.checked === true)
    return checked
  }

  const toggleNavbarLinks = () => {
    const navIcon = document.querySelector('.navIcon')
    const navLinks = document.querySelector('.navLinksWrapper')
    if (navIcon) {
      navIcon.addEventListener('click', () => {
        navLinks.classList.toggle('navLinksWrapperActive')
      })
    }
  }

  const displaySelectedFiles = () => {
    const input = document.querySelector('#fileInput')
    if (input) {
      input.addEventListener('change', function () {
        const files = this.files
        const selectedImages = document.querySelector('.selectedImages')
        if (selectedImages) {
          selectedImages.remove()
        }
        console.log(files)
        const imagesDiv = document.createElement('div')
        imagesDiv.className = 'selectedImages'

        for (let i = 0, numFiles = files.length; i < numFiles; i++) {
          const file = files[i]
          console.log(file.name)
          const image = document.createElement('span')
          image.innerHTML = `${file.name}`
          imagesDiv.append(image)
        }
        input.after(imagesDiv)
      })
    }
  }

  const handleUploadClick = () => {
    const btn = document.querySelector('#btn-upload')
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        const selectedImages = document.querySelector('.selectedImages')
        const input = document.querySelector('#fileInput')
        const tagsInput = document.querySelector('#formTags')
        const permission = document.querySelector('input[name="permission"]:checked').value
        // check if tags are not empty
        const checkTagsInput = tagsInput.checkValidity()
        tagsInput.reportValidity()
        const checkFilesInput = input.checkValidity()
        input.reportValidity()

        const tagsArray = tagsInput.value.split(',').map((tag) => tag.trim())
        if (tagsArray.length > 3) tagsArray.length = 3

        if (checkTagsInput && checkFilesInput) {
          for (let i = 0; i < input.files.length; i++) {
            const XHR = new XMLHttpRequest()
            const FD = new FormData()

            FD.append('fileInput', input.files[i])
            FD.append('permission', permission)
            FD.append('tags', tagsArray)

            XHR.addEventListener('load', function (event) {
              alert(`File ${input.files[i]} uploaded !`)
            })
            // Define what happens in case of error
            XHR.addEventListener(' error', function (event) {
              alert('Oops! Something went wrong.')
            })

            XHR.open('POST', 'https://shopify-backend-images.herokuapp.com/account/upload')
            XHR.send(FD)
          }
          document.querySelector('#formTags').value = ''
          input.value = ''
          if (selectedImages) {
            selectedImages.remove()
          }
        }
      })
    }
  }

  const handleDeleteImages = async () => {
    const btn = document.querySelector('#btn-delete')
    if (btn) {
      btn.addEventListener('click', () => {
        const checked = helperGetCheckboxes()
        checked.forEach(async (checkbox) => {
          const resObject = await fetch('/image/delete', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ imageId: checkbox.id }),
          })
          const res = await resObject.json()
          if (res.deleted === 'TRUE') {
            document.querySelector(`#card-${checkbox.id}`).remove()
          }
        })
      })
    }
  }

  const handlePermissionChangePublic = async () => {
    const btn = document.querySelector('#btn-setPublic')
    if (btn) {
      btn.addEventListener('click', () => {
        const checked = helperGetCheckboxes()
        checked.forEach(async (checkbox) => {
          const resObject = await fetch('/image/permission', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ imageId: checkbox.id, permission: 'public' }),
          })
          const res = await resObject.json()
          if (res.changed === 'TRUE') {
            const tag = document.querySelector(`#tag-${checkbox.id}`)
            tag.className = 'tag-public'
            tag.innerHTML = 'public'
            document.querySelector(`#${checkbox.id}`).checked = 'false'
          }
        })
      })
    }
  }

  const handlePermissionChangePrivate = async () => {
    const btn = document.querySelector('#btn-setPrivate')
    if (btn) {
      btn.addEventListener('click', () => {
        const checked = helperGetCheckboxes()
        checked.forEach(async (checkbox) => {
          const resObject = await fetch('/image/permission', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ imageId: checkbox.id, permission: 'private' }),
          })
          const res = await resObject.json()
          if (res.changed === 'TRUE') {
            const tag = document.querySelector(`#tag-${checkbox.id}`)
            tag.className = 'tag-private'
            tag.innerHTML = 'private'
            document.querySelector(`#${checkbox.id}`).checked = false
          }
        })
      })
    }
  }

  return {
    toggleNavbarLinks,
    displaySelectedFiles,
    handleUploadClick,
    handleDeleteImages,
    handlePermissionChangePublic,
    handlePermissionChangePrivate,
  }
})()

UI.toggleNavbarLinks()
UI.displaySelectedFiles()
UI.handleUploadClick()
UI.handleDeleteImages()
UI.handlePermissionChangePublic()
UI.handlePermissionChangePrivate()
