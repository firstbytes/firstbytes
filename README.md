# First Bytes Society

This is the early stages of the First Bytes Society's web based programming education environment. It is based on the work of many excellent people and projects that preceeded it, like _why's [Hackety Hack](http://hackety.com/), Khan Academy's [Computer Programming Coursework](https://www.khanacademy.org/computing/cs/), John Resig's [ProcessingJS](http://processingjs.org/), and [Codecademy](http://codecademy.com), to name a few.

The First Bytes Society App gets right down to business by immersing the student in legible code from the beginning and encouraing exploration as a means of accidentally learning programming.

## Manifesto

### Don't be "right", be the _hook_
Traditional CS curriculum focuses on teaching things the "right" way. These approaches may start a _proper_ or marketable language, start with the fundamentals (abstraction, encapsulation), dive into specifics (int vs. float vs. unsigned int), push the proper tools, and on and on. If someone had to learn all of the "right" ways of programming before they dove in, we would never have software.

The fact of the matter is most of software people had an initial _hook_ that opened their minds to the potential of programming in a real and impactful way. They usually aren't glamorous or ideal but they get the gears going. It may have been [programming on a TI-83 calculator](http://www.ticalc.org/programming/columns/83plus-bas/cherny/) instead of actually doing math homework, or exploring BASIC on an Atari or even editing a website. **First Bytes Society is first and foremost the hook. The other stuff will come later.**

### Code early and often
Get students looking at code immediately. Immerse them in it. Promote exploration into the code by providing easy ways for students to manipulate code and see the impact of their edits immediately.

### Provide quick feedback channels
Banging your head against a table because you can't figure out why your code isn't running is frustrating for anyone, let alone a beginner. Frustation is detrimental to excitement. Excitement and motivation are required to learn programming. Limit frustration for the student by providing great feedback channels. Provide easy docs, great error feedback, provide easy access to mentors via chat, etc.

### Encourage looking over the shoulder
Build upon the ideas that make the open source community so great. Promote sharing code, work, and stories from day one. Inform students they should use their peers work to help them. Make it easy for students to share their work with others in the community. Make it easy to find other's work. This isn't your typical classroom environment. Copying *is encouraged*!

### Be the megaphone
The only thing more satisfying than seeing your code work, is seeing others use your code. Provide a platform that makes it easy for students to share their finished projects with friends and peers. Not only should this be motivating to the student, but hopefully it will produce a domino effect.

## Development

### Installation

Requrements (older versions may work but have not been tested)

 - [node.js](http://nodejs.org/) (0.10.0+)
 - [npm](https://www.npmjs.org/)  (1.4.0+)
 - [bower](http://bower.io/) (1.2.7+)
 - [grunt](http://gruntjs.com/) (0.1.9+)

To get a local version of First Bytes up and running:

```bash
git clone git@github.com:firstbytes/firstbytes.git
cd firstbytes
npm install
bower install
grunt
```

From here on, just running `grunt` from this directory will start up the app.

## Contributing

First Bytes Society App is open source under the MIT license. First Bytes will only be successful if the open source community rallies behind it. To contribute, please fork the repository, work on a topic branch, and submit open a pull request via GitHub.

Having said that, the project is still _very_ early on in development and may change rapidly. Before diving deep into anything, please open an issue outling the work you'd like to do to make sure it doesn't overlap with the work of others or won't soon be irrelevant. We hope to open up our Trello board soon which is where most of the dev roadmap and feature suggestions will be mulled over.