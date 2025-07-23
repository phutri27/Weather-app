const res = JSON.parse(localStorage.getItem('data'));
localStorage.clear();
document.querySelector('.data').innerHTML = res.resolvedAddress;