var login = (function (lightdm, $) {
    var selected_user = null;
    var password = null
    var $user = $('#user');
    var $pass = $('#pass');

    // private functions
    var setup_users_list = function () {
        var $list = $user;
        var to_append = null;
        $.each(lightdm.users, function (i) {
            var username = lightdm.users[i].name;
            var dispname = lightdm.users[i].display_name;
            $list.append(
                '<option value="' +
                username +
                '">' +
                dispname +
                '</option>'
            );
        });
    };
    var select_user_from_list = function (idx) {
        var idx = idx || 0;

        find_and_display_user_picture(idx);

        selected_user = lightdm.users[idx].name;
        if(selected_user !== null) {
            if (lightdm.in_authentication === true) {
              lightdm.cancel_authentication();    
            }  
            lightdm.authenticate(selected_user);
        }

        $pass.trigger('focus');
    };
    var find_and_display_user_picture = function (idx) {
        $('.profile-img').attr(
            'src',
            lightdm.users[idx].image
        );
    };

    // Functions that lightdm needs
    window.respond = function () {
        password = $pass.val() || null;

        if(password !== null) {
            lightdm.respond(password);
        }
    };
    window.authentication_complete = function () {
        if (lightdm.is_authenticated) {
            lightdm.start_session_sync(lightdm.default_session);
        }
    };
    // These can be used for user feedback
    window.show_error = function (e) {
        alert('Error: ' + e);

    };
    window.show_prompt = function (e) {
        alert('Prompt: ' + e);
    };

    // exposed outside of the closure
    var init = function () {
        $(function () {
            setup_users_list();
            select_user_from_list();

            $user.on('change', function (e) {
                e.preventDefault();
                var idx = e.currentTarget.selectedIndex;
                select_user_from_list(idx);
            });

            $('form').on('submit', function (e) {
                e.preventDefault();
                window.respond();
            });
        });
    };

    return {
        init: init
    };
} (lightdm, jQuery));

login.init();
