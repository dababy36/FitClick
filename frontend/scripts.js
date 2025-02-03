$(document).ready(() => {
 

    // Function to fetch historical fact
    function fetchHistoricalFact() {
        // Show loading animation
        $(".fact-text").html('<div class="loading-spinner"></div>');
        $(".year").html('Loading...');

        // Get a random fact
        $.getJSON("http://numbersapi.com/random/date?json", (data) => {
            $(".fact-text").html(data.text);
            $(".year").html(`Year: ${data.year || "Unknown"}`);
        }).fail((error) => {
            $(".fact-text").html("Error loading historical fact");
            $(".year").html("Year: N/A");
            console.error('Error fetching fact:', error);
        });
    }

    // Initial load
    fetchHistoricalFact();

    // Handle navigation buttons - both will just fetch a new random fact
    $('.controls button').click(function() {
        fetchHistoricalFact();
    });

    // Handle browse button click
    $('.browse-btn').click((e) => {
        e.preventDefault();
        $('#fileInput').click();
    });

    // Handle file input change
    $('#fileInput').change(function() {
        const file = this.files[0];
        if (file) {
            uploadFile(file);
        }
    });

    // Handle drag and drop events
    $('.upload-area')
        .on('dragenter dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).addClass('dragover');
            
            // Update text while dragging
            $(this).find('p').text('Drop to upload!');
        })
        .on('dragleave drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('dragover');
            
            // Reset text
            $(this).find('p').html('Drop your images here or <a href="#" class="browse-btn">browse</a>');
        })
        .on('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const files = e.originalEvent.dataTransfer.files;
            if (files.length > 0) {
                // Handle multiple files
                Array.from(files).forEach(file => {
                    if (file.type.startsWith('image/')) {
                        uploadFile(file);
                    } else {
                        alert('Please upload only image files.');
                    }
                });
            }
        });

    // Prevent default drag behaviors on document
    $(document)
        .on('dragenter dragover dragleave drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });

    // Function to handle file upload
    function uploadFile(file) {
        const formData = new FormData();
        formData.append('image', file);

        $.ajax({
            url: 'http://localhost:3000/api/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                alert('File uploaded successfully!');
                console.log(response);
            },
            error: function(xhr, status, error) {
                alert('Upload failed: ' + error);
                console.error(xhr.responseText);
            }
        });
    }

    // Modal functionality
    $('.add-user').click(function() {
        $('#userModal').addClass('active');
    });

    $('.close-modal').click(function() {
        $(this).closest('.modal').removeClass('active');
    });

    // Update the window click handler for both modals
    $(window).click(function(e) {
        if ($(e.target).hasClass('modal')) {
            $('.modal').removeClass('active');
        }
    });



   

    // Add click handler for notification close button
    $('.notification-close').click(function() {
        hideNotification();
    });

    // Handle form submission
    $('#userForm').submit(function(e) {
        e.preventDefault();
        
        const userData = {
            name: $('#name').val(),
            email: $('#email').val(),
            password: $('#password').val()
        };


       
        
        const emailError = $('.email-error');
        

        // Make API call to create user
        $.ajax({
            url: 'http://localhost:3000/api/users/add',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function(response) {
                alert('User account created successfully!');
                $('#userForm')[0].reset();
                $('#userModal').removeClass('active');
            },
            error: function(xhr, status, error) {
                emailError.text('Error: ' + (xhr.responseJSON?.error || error));
                // after 3 seconds, hide the error message
                setTimeout(() => {
                    emailError.text('');
                }, 3000);
            }
        });
    });

    // Add this to your existing JavaScript
    $('.show-users').click(function() {
        $('#usersListModal').addClass('active');
        loadUsers();
    });

    function loadUsers() {
        const tbody = $('#usersTableBody');
        
        // Show loading animation
        tbody.html(`
            <tr>
                <td colspan="4">
                    <div class="loading-container">
                        <div class="loading-spinner"></div>
                    </div>
                </td>
            </tr>
        `);

        $.ajax({
            url: 'http://localhost:3000/api/users/list',
            type: 'GET',
            success: function(response) {
                tbody.empty();
                
                if (response.users && response.users.length > 0) {
                    response.users.forEach((user, index) => {
                        const tr = $(`
                            <tr style="opacity: 0; transform: translateY(20px);">
                                <td>${user.name || 'N/A'}</td>
                                <td>${user.email || 'N/A'}</td>
                                <td>${user.type || 'user'}</td>
                                <td class="${user.active ? 'status-active' : 'status-inactive'}">
                                    ${user.active ? 'Active' : 'Inactive'}
                                </td>
                            </tr>
                        `);
                        
                        tbody.append(tr);
                        
                        // Animate each row with delay
                        setTimeout(() => {
                            tr.css({
                                'transition': 'all 0.3s ease',
                                'opacity': '1',
                                'transform': 'translateY(0)'
                            });
                        }, index * 100);
                    });
                } else {
                    tbody.html(`
                        <tr>
                            <td colspan="4" style="text-align: center;">
                                No users found in database
                            </td>
                        </tr>
                    `);
                }
            },
            error: function(xhr, status, error) {
                tbody.html(`
                    <tr>
                        <td colspan="4" style="color: red; text-align: center;">
                            Error loading users: ${error}
                        </td>
                    </tr>
                `);
            }
        });
    }

    // Theme toggle functionality
    const themeToggle = $('#themeToggle');
    const themeIcon = $('.theme-icon');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        $('body').addClass('dark-theme');
        themeIcon.text('☀️');
    }

    // Theme toggle click handler
    themeToggle.click(function() {
        const body = $('body');
        body.toggleClass('dark-theme');
        
        // Update icon and save preference
        if (body.hasClass('dark-theme')) {
            themeIcon.text('☀️');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.text('🌙');
            localStorage.setItem('theme', 'light');
        }
    });
});
