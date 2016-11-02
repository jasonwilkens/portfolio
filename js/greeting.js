const greeting = document.querySelector('#greeting');
const date = new Date();
const hour = date.getHours();

if (hour < 12) {
  greeting.textContent = 'Good morning';
} else if (hour < 18) {
  greeting.textContent = 'Good afternoon';
} else {
  greeting.textContent = 'Good evening';
}