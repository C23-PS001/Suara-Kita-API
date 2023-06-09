const VotingController = require('../controller/voting.controller')

module.exports = function (app) {
    app.get(
        '/voting',
        VotingController.getVotingCount
    ),
    
    app.post(
        '/voting',
        VotingController.doVoting
    ),

    app.get(
        '/voting/checkUser/:nik',
        VotingController.isUserVote
    )
}