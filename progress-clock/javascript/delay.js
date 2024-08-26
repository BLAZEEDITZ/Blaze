function getRandomDelay(min, max) {
    return Math.random() * (max - min) + min;
}
var randomDelay = getRandomDelay(3000, 9000);
setTimeout(function() {
    document.querySelector('.loading-screen').style.display = 'none';
    document.querySelector('.main-content').style.display = 'block';
}, randomDelay);