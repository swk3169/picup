var util = {};

util.arrayBufferToBase64Img = function ( buffer ) {
  let binary = '';
  let bytes = new Uint8Array( buffer );
  let len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return 'data:image/jpeg;base64,' + window.btoa( binary );
}

util.readUploadedFileAsDataURL = function (inputFile) {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      return reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      return resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsDataURL(inputFile);
  });

};

util.dateFormatting = function (date) {
  var items = date.split('T');
  return items[0] + ' ' + items[1].substring(0, 8);
}

util.getResource = function (resourcePath) {
  return 'http://localhost:4000/' + resourcePath;
}

util.extractRegion = function (compondCode) {
  var items = compondCode.split(' ');
  return items[2];
}

util.birthFormatting = function (date) {
  var items = date.split('T');
  return items[0];
}

util.genderFormatting = function (gender) {
  return gender == 0 ? '남' : '여';
}

export default util;