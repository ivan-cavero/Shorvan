import { execSync, spawnSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import readline from 'node:readline'

const rl =  readline.createInterface(process.stdin, process.stdout)

const isWindows = process.platform === 'win32'
const isDebug = process.argv.includes('--debug')

const reset = "\x1b[0m"

const log = {
    info: (text) => console.log(`\x1b[90m${text}${reset}`),
    error: (text) => console.log(`\x1b[31m${text}${reset}`),
    warn: (text) => console.log(`\x1b[33m${text}${reset}`),
    success: (text) => console.log(`\x1b[32m${text}${reset}`),
    debug: (text) => isDebug && console.log(`\x1b[34m${text}${reset}`)
}

/* The whole process */

log.info('Starting publishing process...')

let nextVersion

fetchOlderVersions()
await changeVersion()
await generatingPublishNote()
preRelease()
checkout()

function fetchOlderVersions() {
    log.info('Fetching older versions...')
    const gitCommands = [
        'git checkout main',
        'git pull origin main',
        'git fetch origin main --prune --tags'
    ]

    const commandsToExecute = isDebug
        ? gitCommands
        : gitCommands.map(cmd => `${cmd} ${isWindows ? '> NUL 2>&1 || exit 0' : '> /dev/null 2>&1 || exit 0'}`)

    try {
        commandsToExecute.forEach(cmd => execSync(cmd))
        log.success('Older versions fetched!')
    } catch (error) {
        log.error('Unsupported platform or git command failed.')
        if (isDebug) throw error
        process.exit(1)
    }
}

async function changeVersion () {
    log.info('Updating version number...')
  
    const packageJson = require('../../package.json')
    const currentVersion = packageJson.version
    let versionNumberValid = false
    let version

    const checkVersionNumber = (cur, next) => {
        // Must be numbers and dots.
        if (!/^[0-9][0-9.]{1,10}[0-9]$/.test(next)) {
          return false
        }
    
        const curArr = cur.split('.')
        const nextArr = next.split('.')
        const length = curArr.length
    
        if (curArr.length !== nextArr.length) {
          return false
        }

        for (let i = 0; i < length; i++) {
            if (Number.parseInt(curArr[i]) < Number.parseInt(nextArr[i])) {
                return true
            }
            if (Number.parseInt(curArr[i]) > Number.parseInt(nextArr[i])) {
                return false
            }
            if (i === length - 1 && curArr[i] === nextArr[i]) {
                return false
            }
        }
    }

    while (!versionNumberValid) {
        const versionDefault = currentVersion.split('.').map((part, index) => index === 2 ? Number.parseInt(part) + 1 : part).join('.')

        version = await new Promise(resolve => {
            rl.question(`Version number (default: ${versionDefault}): `, input => {
                resolve(input.trim() || versionDefault)
            })
        })

        if (checkVersionNumber(currentVersion, version)) {
            versionNumberValid = true
            nextVersion = version

            log.debug(`Executing: git checkout -b publish-${nextVersion}`)
            execSync(`git checkout -b publish-${nextVersion}`)
    
            log.debug('Executing: git merge develop')
            execSync('git merge develop')    

            packageJson.version = version
            writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))

            log.success(`Version number updated to ${version}!`)
        } else {
          log.error(`Your input ${version} is not after the current version ${currentVersion} or is invalid. Please check it.`)
        }
    }
}

async function generatingPublishNote() {
    log.info('Generating changelog...')
    execSync('bun run changelog')
    log.success('Changelog generated!')

    while (true) {
        const result = await new Promise(resolve => {
            rl.question('Please manually update docs/changelog. Press [Y] if you are done: ', input => {
                resolve(input.trim().toLowerCase())
            });
        });

        if (result === 'y') {
            rl.close()
            break
        }
    }

    log.success('Change log finished!');
}

function preRelease() {
    log.info('Running pre-release script...')
    // execSync('bun run pre-release')
    log.info('pre-release completed!')
}

function checkout() {
    try {
        log.info('Checkout and push a new branch for publishing...')

        log.debug('Adding changes to Git index...')
        execSync('git add .')
        
        const commitMessage = `Release (${nextVersion}): package.json and CHANGELOG.md`
        log.debug(`Executing: git commit -m "${commitMessage}"`)
        spawnSync('git', ['commit', '-m', commitMessage])

        log.debug(`Executing: git push origin publish-${nextVersion}`)
        execSync(`git push origin publish-${nextVersion}`)
        
        log.success('Please go to GitHub and make a pull request.')
    } catch (error) {
        log.error('Error occurred during the process.')
        if (isDebug) throw error
        process.exit(1)
    }
}