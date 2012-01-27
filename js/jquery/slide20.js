function animateServer() {
  setTimeout("$$('#tweenty-server').fadeIn({duration:2000,complete:function(){animateRemote();}});", 500);
}
function animateRemote() {
  setTimeout("$$('#tweenty-remote').fadeIn({duration:2000,complete:function(){  animateEmail();}});", 1500);
}
function animateEmail() {
  setTimeout("$$('#tweenty-email').fadeIn({duration:2000,complete:function(){  animateFilesharing();}});", 1800);
}
function animateFilesharing() {
  setTimeout("$$('#tweenty-filesharing').fadeIn({duration:2000,complete:function(){  animateDataprotect();}});", 2100);
}
function animateDataprotect() {
  setTimeout("$$('#tweenty-dataprotect').fadeIn({duration:2000,complete:function(){  animateWebserver();}});", 2400);
}
function animateWebserver() {
  setTimeout("$$('#tweenty-webserver').fadeIn({duration:2000,complete:function(){  animateBackup();}});", 2700);
}
function animateBackup() {
  setTimeout("$$('#tweenty-backup').fadeIn({duration:2000,complete:function(){  animateBigbiz();}});", 3000);
}
function animateBigbiz() {
  setTimeout("$$('#tweenty-bigbiz').animate({duration:2000,width: '230px',height: '65px',complete:function(){  animateLines();}});", 4000);
}
function animateLines() {
  setTimeout("$$('#tweenty-lines').fadeIn({duration:5000,complete:function(){  animateServer();}});", 5000);
}
