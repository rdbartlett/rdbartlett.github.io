# This Machine Eats Monotheistic Meta Memes
## Some scuttlebutt about Scuttlebutt

π¦ β hey squiddo, I can't remember if we talked about [Scuttlebutt]((http://scuttlebutt.nz) yet. are you familiar? just a good one to have on your radar, v cool people with excellent tech and zero hype and bullshit

π¦ β *Hmm interesting, is Scuttlebutt running in production for something yet? Itβs like a service to run other things on, no?*

π¦ β secure scuttlebutt (ssb) it's a very low level protocol. works like gossip: messages spread between peers. uses the internet if it is available, but doesn't need it: local wifi, bluetooth (coming soon), or USB sticks are enough.

identities have logs. log = a sequence of messages. they're cryptographically authenticated so you can guarantee who said what. identities can follow each other. you replicate the logs of your peers. no central server, no off switch, no delete. so if you want to find me, you need to find one of my peers first. creates peer-to-peer archipelagos of friends and data connected by their relationships.

data can be of any type. apps decide what types of messages they pay attention to. e.g. Patchwork is a social media app, with a few hundred daily active users. other apps: a chess game, distributed github clone, soundcloud clone, blogging client, events, calendar, loomio clone, etc etc etc.

it is exciting because there is a steadily growing community, like great new developers showing up every week or two. and it is the only decentralised tech project I know of that is populated by really gentle, caring, community-building, good politics, critically aware but having fun kinda people


π¦ β *Aha very cool, Iβll dig into it more and start following whatβs going on. Sounds like a very interesting concept!*

π¦ β its dooope. still bleeding edge in many places, so let me know if you get stuck on the way in

but it is getting to the point now where it is more than just my ultra nerd friends in there having a nice time. e.g. [here's a web view](http://between-two-worlds.dk:8807/%25mKT6jXvpAFN5l2blx1qdQgLbounkgnHkYooZBUB57KU%3D.sha256) of a newsletter summarising activity in the scuttleverse this past week.


π¦ β *So if you were to think about applications to what weβre doing with our festival community, what would they be?*

π¦ β think of all the apps you currently use, but imagine they work offline-first

I think it could be a cool on-site mesh network for the festival, to start with, and then people will be delighted to find they can still stay in touch later, because it uses the internet if it is available

π¦ β *How does it work, with regard to timing, when it cannot be ensured that messages are received in order?*

π¦ β that's right, you can't guarantee order, there's a lot of little weirdnesses like that which pop up in a purely subjective universe. messages always reference messages before them, so you can infer order

but yeah sometimes in discussions you will see "oh sorry I didn't have your message when I wrote my comment". but actually so far that seems mostly to be a feature, a constant reminder that you are just one subjective agent, there is no official arbiter of truth, everyone has a different experience of the world.

you'd be surprised at how much uptime there is when you have a few peers in a web of tight relationships, there's nearly always someone online. so you don't notice it much

you also will see missing messages, like, 'someone wrote a comment here but they are outside of your network so you can't see it'

which again, sounds like a bug, but I experience it as a feature. it's very subtle but you keep getting these reminders that there is no single source of truth. 

π¦ β*Hmm right, so you need to have done explicit individual authentication with each every other party?*

π¦ β some of the peers are special, they're called "pubs". practically the only special thing about them is they are guaranteed to have much higher uptime than your average peer and they can hand out "invites". If you redeem an invite, that means you follow them, and they automatically follow you back. they work a bit like servers, but not much

so if you connect to a pub that I'm connected to, you'll be able to find me

then you'll see a list of people that I've followed, and you can choose if you believe the name and avatar is who you think it is

there's not an emphasis on real world identity verification, but it could be done. most people use real names but a decent fraction also enjoy pseudonyms

π¦ β *Ah right, and if a pub sees your activity, and Iβm connected to the pub, I see your activity?*

π¦ β yep, but there are people who follow no pubs, and they have a fine experience too, so long as there are a few friends of friends

π¦ β *Gotcha. Yeah, there are definite interesting advantages of this, for sure*

π¦ β you can also extend your range, they call it "hops". by default hops is set to 2, so when you follow me, you replicate my feed, plus all my friend's feeds. in Patchwork you can see the "extended network" which will show you everything public from your the friends of your friends.

My tech knowledge is pretty patchy so I might be misrepresenting the details. Iβm not the official source of truth. (there isnβt one.)

when you get deep into it, the main advantage i see is that it is agent centric (people, relationships), rather than location centric (documents, websites). so I have built up a web of relationships and content on my identity. When I move from Patchwork (social media) to Ticktack (blogging) to GitSSB (github clone), all my relationships and data come with me.

solves one of the common headaches of running online communities: you define the group once, and bring that definition with you to any app you want to use. seriously reduces onboarding friction

which means you actually have competition for social media interfaces, there's no walled garden that owns your social graph

so the geeker types don't use Patchwork, they use Patchbay, which has the same people and content, but a different interface that sacrifices some UX niceities but gets you closer to the code

π¦ β *Right, but that also means that you become a carrier for a lot of messages that someone else with the right key could decrypt, ensuring more redundancy and coverage of data*


π¦ β so long as you keep your secret key, you can lose your computer and rebuild all your past data based on the copies your friends are keeping for you

as one of the 'butts said, your friends are now the data centre.

π¦ β *Ah. Yeah. Got it. Thatβs a huge advantage.*

π¦ β Can I have your permission to publish this conversation?

π¦ β *Absolutely! If itβs useful to have my identity attached to the conversation, you have my permission for that too*

π¦ β thanks. i think i will recast you as a sweet emoji friend

π¦ β *Yeees! Haha*