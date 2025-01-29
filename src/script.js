function filterByPrice() {
    const container = document.querySelector('.container');
    const recipes = Array.from(container.children);
    const filterValue = document.getElementById('priceFilter').value;

    const sortedRecipes = recipes.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('p').innerText.replace('$', ''));
        const priceB = parseFloat(b.querySelector('p').innerText.replace('$', ''));

        return filterValue === 'lowToHigh' ? priceA - priceB : priceB - priceA;
    });

    // Clear the container and append the sorted recipes
    container.innerHTML = '';
    sortedRecipes.forEach(recipe => container.appendChild(recipe));
}

// Add event listeners to all comment buttons
document.querySelectorAll('.comment-btn').forEach(button => {
    button.addEventListener('click', function() {
        const commentBox = this.nextElementSibling;
        commentBox.style.display = commentBox.style.display === 'block' ? 'none' : 'block';
    });
});

// Add event listeners to all submit buttons
document.querySelectorAll('.submit-comment').forEach(button => {
    button.addEventListener('click', function() {
        const commentBox = this.parentElement;
        const textarea = commentBox.querySelector('textarea');
        alert('Comment submitted: ' + textarea.value);
        textarea.value = ''; // Clear the textarea
        commentBox.style.display = 'none'; // Hide the comment box
    });
});