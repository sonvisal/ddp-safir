Meteor.methods({
    regUser: function(firstname, lastname, email, password, shipcard, point, rerole, country, city, username, img_id) {
        targetUserId = Accounts.createUser({
            username: username,
            email: email,
            password: password,
            profile: { firstname: firstname, lastname: lastname, name: username, country: country, city: city, imageId:img_id, earnpoint:0, shipcard: { membershipID: shipcard, point: point } }
        });
        console.log(targetUserId);
        //Roles.setUserRoles(id, roleid, 'noolab')
        Roles.setUserRoles(targetUserId, [rerole], 'mygroup');
        return {email:email};
    }
});
