# Portsmouth Degree Calculator App

This project is a webapp that calculates a student's final degree classification and GPA by indicating how module marks can combine. It allows students to input their UP number and have their modules and achieved grades automatically inputted. Students can also set a target degree classification and find the minimum grades needed to achieve that target, with modules requiring extra work highlighted. The app also shows an average for second-year modules, which predicts the final year mark.

This is an improved version of [Portsoc's Dcalc](https://github.com/portsoc/dcalc), with new features and visual changes.

Ideally, this implementation will eventually be merged into the original and be available as a fully functioning webapp at that same web address. For now, to run this implementation:

## Functionality

This implementation can be run locally.

To do so:

1. You will need an API key to be able to make requests to the University API, as well as be connected to the University VPN.

2. When you have cloned the repository locally, you need to add the API key to a `headers.json` file in the `config` directory.

3. Then you need to run `npm i express` to install the required `express` framework.

4. After that is done ensure that your path is setup correctly in the `package.json` file to run the `openssl.cnf` file as well as the `server.js` file simultaneously.

You will then be able to open the page on the `localhost` port it is set to.

## Authors

This current implementation was developed by a group of Second Year, Software Engineering students:

[Will W](https://github.com/wgw0), [Nikita C](https://github.com/NikBit101), [Marta R](https://github.com/m0urao), [Sint Lwin H](https://github.com/sint18), [Mark C](https://github.com/mark-chit), [Pablo B](https://github.com/PabloBeJ).

## Acknowledgments

The original implementation was designed and built by [Dr Rich](https://github.com/ear1grey) & [Dr Jacek](https://github.com/jacekkopecky) during four lectures, this implementation is built off a fork of what they have built. The original can be found at: [http://soc.port.ac.uk/dcalc/](http://soc.port.ac.uk/dcalc/)
