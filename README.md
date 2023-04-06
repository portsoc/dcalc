# Portsmouth Degree Calculator App

This project is a webapp that calculates a student's final degree classification and GPA by indicating how module marks can combine. It allows students to input their UP number and have their modules and achieved grades automatically inputted. Students can also set a target degree classification and find the minimum grades needed to achieve that target, with modules requiring extra work highlighted. The app also shows an average for second-year modules, which predicts the final year mark.

This is an improved version of [Portsoc's Dcalc](https://github.com/portsoc/dcalc), with new features and visual changes.

Ideally, this implementation will eventually be merged into the original and be available as a fully functioning webapp at that same web address. For now, to run this implementation:

## Functionality

This implementation can be run locally.

1. Make sure you have `git pull` this branch, up to date.
2. Ensure that the `package.json` file in the base has the correct starting script. It should run `npm install` and `server.js` and the `config/openssl.cnf` file.
The start line should look something like this: 
`"npm install && set OPENSSL_CONF=YOUR\\PATH\\dcalc_ext\\config\\openssl.cnf && node server.js"`
1. Connect to the University VPN.
2. Start the webapp by typing `npm start` in the console of VSCode. Then when it has told you this message:
```
> dcalc_ext@1.0.0 start        
> npm install && set OPENSSL_CONF=YOUR\\PATH\\dcalc_ext\\config\\openssl.cnf && node server.js

up to date, audited 64 packages in 2s

10 packages are looking for funding  
  run `npm fund` for details

found 0 vulnerabilities
server enabled
```
Navigate to your browser and access localhost:80
5. This should open the webapp and it should be functional. You may need to refresh the page to clear the cache if you are experiencing any oddities.
6. Use some of the following UP numbers to test the module input functionality:
```
Level 5's;
- 369163290
- 369174131 (3 modules)
- 369143394 (4 modules)

Level 6's;
- 369147309
- 369138991
- 369116657 (1 module)
```
7. Make note of whether or not it functioned as expected in the Discord chat.

## Authors

This current implementation was developed by a group of Second Year, Software Engineering students:

[Will W](https://github.com/wgw0), [Nikita C](https://github.com/NikBit101), [Marta R](https://github.com/m0urao), [Sint Lwin H](https://github.com/sint18), [Mark C](https://github.com/mark-chit), [Pablo B](https://github.com/PabloBeJ).

## Acknowledgments

The original implementation was designed and built by [Dr Rich](https://github.com/ear1grey) & [Dr Jacek](https://github.com/jacekkopecky) during four lectures, this implementation is built off a fork of what they have built. The original can be found at: [http://soc.port.ac.uk/dcalc/](http://soc.port.ac.uk/dcalc/)
