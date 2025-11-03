import * as fs from 'fs'

(function setupRequiredFolders() {

    createMissingFolders('./input')
    createMissingFolders('./output')

    function createMissingFolders(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

})()

const exportedWorkflows = JSON.parse(fs.readFileSync('./input/workflow_export.json'))

/*
 * written by ChatGPT
 * prompt: Could you write me a function that returns a string of
 * numbers that represent the current date and time in the format
 * yyyymmddhhmm in JavaScript?
 */
const getCurrentDateTimeTag = () => {
    const now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0') // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')

    return `${year}${month}${day}${hours}${minutes}`
}

const getWorkflowLink = (id) =>
    `https://omega.omega365.com/nt/scope-workflow?ID=${id}`

const simplifiedWorkflows = exportedWorkflows.map(d => ({
    title: d.Title,
    description: d.Description,
    id: d.ID,
    link: getWorkflowLink(d.ID)
}))

fs.writeFileSync(
    `./output/workflow_scope_items_${getCurrentDateTimeTag()}.json`,
    JSON.stringify(simplifiedWorkflows, null, 4)
)

const getHyperlinkedTitle = ({ id, title }) =>
    `[[${id}](${getWorkflowLink(id)})] ${title}`

const getWorkflowsMarkdown = (workflows) => {
    let output = '# Workflow Scope Items\n'
    if (workflows.length > 0) {
        output += '\n'
        output += workflows.map(task => {
            let taskOutput = '## ' + getHyperlinkedTitle(task) + '\n'
            if (task.description) {
                taskOutput += '\n``` text\n' + task.description + '\n```\n'
            }
            return taskOutput
        })
            .join('\n')
    }
    return output
}

fs.writeFileSync(
    `./output/workflow_scope_items_${getCurrentDateTimeTag()}.md`,
    getWorkflowsMarkdown(simplifiedWorkflows)
)