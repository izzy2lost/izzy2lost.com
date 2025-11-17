document.getElementById("crtSwitch")?.addEventListener("change",e=>{
 document.body.classList.toggle("crt-on",e.target.checked);
 document.body.classList.toggle("crt-off",!e.target.checked);
});
