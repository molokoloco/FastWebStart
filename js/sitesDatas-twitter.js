var SITES = [ 
	{title: 'TWITTER', data : [ 
	{href:'http://www.twitter.com', result:'https://twitter.com/#!/search/{R}', tips:'Recherche dans les conversation Twitter', title:'Twitter'},
	{href:'http://search.twitter.com', result:'http://search.twitter.com/search?q={R}', tips:'Recherche sur Twitter', title:'TwitterSearch'},
	{href:'http://search.twitter.com/advanced', result:'http://search.twitter.com/search?q={R}', tips:'Recherche avanc&eacute;e sur Twitter', title:'TwitterAdvancedSearch'},
	{href:'https://twitter.com/search-advanced', result:'https://twitter.com/#!/search/{R}', tips:'Recherche avanc&eacute;e sur Twitter', title:'TwitterAdvancedSearchV2'},
	{href:'http://help.twitter.com', result:'http://help.twitter.com/search?query={R}', tips:'Aide Twitter', title:'TwitterHelp'},
	{href:'http://status.twitter.com', result:'', tips:'Etat de fonctionnement du service Twitter', title:'TwitterStatus'},
	{href:'http://apiwiki.twitter.com', result:'http://apiwiki.twitter.com/FindPage?SearchFor={R}', tips:'Welcome to the Twitter API wiki', title:'TwitterApiWiki'},
	{href:'http://twitter.pbworks.com', result:'http://twitter.pbworks.com/FindPage?SearchFor={R}', tips:'Twitter Fan Wiki', title:'TwitterFanWiki'}	
	]}, {title: 'RECHERCHES', data : [
	{href:'http://www.picfog.com', result:'', tips:'Real-time image search', title:'Picfog'},
	{href:'http://www.neoformix.com/Projects/TwitterStreamGraphs/view.php', result:'', tips:'Twitter Stream Graphs', title:'TwitterStreamGraphs'},
	{href:'http://www.twitmatic.com', result:'', tips:'Real-time video search', title:'TwitMatic'},
	{href:'http://www.twitterfall.com', result:'', tips:'Reeal-time tweet searches', title:'TwitterFall'},
	{href:'http://www.google.com/search?hl=en&esrch=RTSearch&tbo=p&tbs=rltm%3A1&q=twitter&aq=f&oq=&aqi=g10', result:'http://www.google.com/search?hl=en&esrch=RTSearch&tbo=p&tbs=rltm%3A1&q={R}&aq=f&oq=&aqi=g10', tips:'Google index of Twitts in real time', title:'GoogleRealtimeTwitts'},
	{href:'http://topsy.com', result:'http://topsy.com/s?q={R}', tips:'A search engine powered by tweets', title:'Topsy'},
	{href:'http://www.backtype.com', result:'http://www.backtype.com/search?q={R}', tips:'Recherche en temps réel de conversation', title:'BackType'},
	]}, {title: 'AROUND YOU', data : [
	{href:'http://www.isparade.jp', result:'', tips:'Let\'s parade with people', title:'IsParade'},
	{href:'http://apps.asterisq.com/mentionmap/', result:'http://apps.asterisq.com/mentionmap/#user-{R}', tips:'You\'re looking at a map of mentions', title:'MentionMap'},
	{href:'http://beta.twittervision.com', result:'', tips:'Twitts WorlMap', title:'TwitterVision'},
	{href:'http://www.twittearth.com', result:'', tips:'Twitts in a 3D WorlMap', title:'TwittEarth'},
	{href:'http://www.geochirp.com', result:'', tips:'Geo Twitts around you', title:'GeoChirp'},
	{href:'http://www.twittergrader.com/location/', result:'http://twittergrader.com/location/?Location={R}', tips:'Top users by Location', title:'TwitterGrader'},
	{href:'http://www.twitterforbusypeople.com', result:'', tips:'Find Twitts from people you follow', title:'TwitterForBusyPeople'},
	{href:'http://www.twittertim.es', result:'', tips:'The Twitter Times is a real-time personalized newspaper', title:'TwitterTim.es'},
	{href:'http://www.tweetstats.com', result:'http://tweetstats.com/graphs/{R}', tips:'Makin\' Your Twitter Graf!', title:'TweetStats'},
	{href:'http://www.twitteradar.com', result:'', tips:'Twitter , Les Tweets et la Twitosph&eacute;re', title:'TwitteRadar'},
	{href:'http://www.trendsmap.com', result:'http://trendsmap.com/local/fr/{R}', tips:'Real-time mapping of Twitter trends across the world', title:'TwitteRadar'},
	{href:'http://www.bing.com/maps/explore/#5003/0.40326', result:'http://www.bing.com/maps/explore/#5003/0.6002=q:{R}', tips:'Bing Twitter Maps', title:'BingTwitterMaps'}
	]}, {title: 'MEDIAS', data : [
	{href:'http://www.visibletweets.com', result:'http://visibletweets.com/#query={R}&animation=1', tips:'What Twitts do you want to visualize', title:'VisibleTweets'},
	{href:'http://www.neuroproductions.be/twitter_friends_network_browser/', result:'', tips:'What Twitts do you want to visualize', title:'TwitterFriendsNetwork'},
	{href:'http://www.infinitecomic.com', result:'http://infinitecomic.com/index.php?form=create&terms={R}', tips:'Infinite comic', title:'InfiniteComic'},
	{href:'http://www.wearehunted.com', result:'http://wearehunted.com/music/news/{R}', tips:'The Online Music Chart', title:'WeAreHunted'},
	{href:'http://www.hypem.com/twitter/popular', result:'http://hypem.com/search/{R}/1/', tips:'Twitter Music Chart: Hot Songs Tracks MP3 on Twitter', title:'HypeMachine'}
	]}, {title: 'ORDERING', data : [
	{href:'http://www.hashtags.org', result:'http://www.hashtags.org/{R}', tips:'Indexation des hashtags utilis&eacute;s sur Twitter', title:'Hashtags'},
	{href:'http://www.hashparty.com', result:'http://www.hashparty.com/{R}', tips:'Is about... do you know', title:'HashParty'},
	{href:'http://www.refollow.com', result:'', tips:'Discover, manage, and protect your Twitter social circle', title:'ReFollow'},
	{href:'http://www.wefollow.com', result:'http://wefollow.com/twitter/{R}', tips:'User Powered Twitter Directory', title:'WeFollow'},
	{href:'http://www.twittorati.com', result:'http://twittorati.com/search/{R}', tips:'Top Blogs on Twitter', title:'TwittOrati'},
	{href:'http://www.tweetmeme.com', result:'http://tweetmeme.com/search?q={R}', tips:'Search the Hottest on Twitter', title:'TweetMeme'},
	{href:'http://www.twopular.com/labs', result:'', tips:'Visualizing the twitter hype', title:'TwoPularLabs'},
	{href:'http://twittersentiment.appspot.com', result:'http://twittersentiment.appspot.com/search?query={R}', tips:'What\s the feeling about a word', title:'TwitterSentiment'},
	{href:'http://www.chirrps.com', result:'http://chirrps.com/?q={R}', tips:'The most popular tweets on the web', title:'Chirrps'},
	{href:'http://www.thoora.com', result:'http://thoora.com/?c=searcher&q={R}', tips:'Top stories, headlines, world reaction, breaking news', title:'Thoora'},
	{href:'http://www.favstar.fm', result:'http://favstar.fm/users/{R}', tips:'Most popular recent tweets', title:'FavStar'},
	{href:'http://mirror.me', result:'http://mirror.me/search/{R}', tips:'Explore your interest community ', title:'MirrorMe'}
	]}, {title: 'UTILITIES', data : [
	{href:'http://www.twitpic.com', result:'http://twitpic.com/tag/{R}', tips:'Service d\'h&eacute;bergement d\'image pour Twitter', title:'TwitPic'},
	{href:'http://www.yfrog.com', result:'http://yfrog.com/search.php?s={R}', tips:'Your images and videos on Twitter', title:'YFrog'},
	{href:'http://www.tinyurl.com', result:'', tips:'Shorten your link for Twitter', title:'TinyUrl'},
	{href:'http://www.bit.ly', result:'', tips:'Shorten your link with stats for Twitter', title:'BitLy'},
	{href:'http://www.twitlonger.com', result:'', tips:'You talk to much', title:'TwitLonger'},
	{href:'http://www.screenr.com', result:'http://twitter.com/#search?q=screenr%20{R}', tips:'Create on the fly screen recordings', title:'ScreenR'},
	{href:'http://www.tweetbeep.com', result:'', tips:'Twitter Alerts by Email', title:'TweetBeep'},
	{href:'http://www.twitterfeed.com', result:'', tips:'Feed your blog to Twitter', title:'TwitterFeed'},
	{href:'http://www.hootsuite.com', result:'', tips:'Gestion avanc&eacute;e et multi-compte', title:'HootSuite'},
	{href:'http://www.programmableweb.com/api/twitter/mashups', result:'', tips:'Programmableweb.com/api/twitter/mashups', title:'TwitterMashups'}]}
];