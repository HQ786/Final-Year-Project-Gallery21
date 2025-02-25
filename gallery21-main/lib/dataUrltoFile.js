export function dataURLtoFile(dataurl, filename) {
    // Extract the base64 data from the dataURL
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    
    // Create a Uint8Array from the base64 data
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    // Create and return a File object
    return new File([u8arr], filename, {type:mime});
  }
  
