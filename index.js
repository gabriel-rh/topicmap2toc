const asciidoctor = require("asciidoctor.js")();
const yaml = require('js-yaml')
const fs = require('fs');


let home = "/home/gmcgoldr/";
let docsFolder = home + "/github/openshift-docs-latest";

//let topicMap = docsFolder + '/_topic_maps/_topic_map.yml';
let topicMap = '_topic_map.yml';

let currDistro = "openshift-enterprise";

let logFile = home + "/temp/toc.log";

let currLevel = 0;

try {
    var toclog = fs.createWriteStream(logFile);
    process.stderr.write = toclog.write.bind(toclog);

    let fileContents = fs.readFileSync(topicMap, 'utf8');
    let data = yaml.loadAll(fileContents);

    console.log("main-menu:")

    for (var topic of data)
    {
        processTopic(topic, '');
    }

} catch (e) {
    console.log(e);
}

function processTopic(topic, dir)
{

    if (topic.Dir)
    {
        if (!topic.Distros || topic.Distros.indexOf(currDistro) !== -1)
        {
            currLevel++;

            let offset = "  " + "    ".repeat(currLevel-1);

            console.log(offset + "- name: " + topic.Name)
            console.log(offset + "  items:")

            for (var subtopic of topic.Topics)
                processTopic(subtopic, dir + '/' + topic.Dir)

            currLevel--;
        }   
    }
    else
    {
        if (!topic.Distros || topic.Distros.indexOf(currDistro) !== -1)
            processAdoc(dir, topic.File);
    }

}

function processAdoc(dir, file)
{

    var adocFile = docsFolder + dir + "/" + file + ".adoc";

    const doc = asciidoctor.loadFile(adocFile, {'attributes': { 
        'product-version': '4.9', 
        'product-title': 'OpenShift Container Platform', 
        'op-system-first': 'Red Hat Enterprise Linux CoreOS (RHCOS)',
        'op-system': 'RHCOS',
        'op-system-base': 'RHEL',
        'op-system-base-full': 'Red Hat Enterprise Linux (RHEL)',
        'rh-virtualization-first': 'Red Hat Virtualization (RHV)',
        'rh-virtualization': 'RHV',
        'odo-title': 'odo',
        'sandboxed-containers-first': 'OpenShift sandboxed containers',
        'sandboxed-containers-operator': 'OpenShift sandboxed containers Operator',
        'rh-openstack': 'RHOSP',
        'pipelines-title': 'Red Hat OpenShift Pipelines',
        'gitops-title': 'Red Hat OpenShift GitOps',
        'servicebinding-title': 'Service Binding Operator',
        'ProductName': 'Red Hat OpenShift Service Mesh',
        'ServerlessProductName': 'OpenShift Serverless',
        'ServerlessOperatorName': 'OpenShift Serverless Operator',
        'FunctionsProductName': 'OpenShift Serverless Functions',
        'VirtProductName': 'OpenShift Virtualization'
         }}); 


    let offset = "  " + "    ".repeat(currLevel);

    console.log(offset + "- name: " + doc.getDocumentTitle());

    let path = dir + "/" + file + ".adoc";

    console.log(offset + "- path: " + path.substring(path.indexOf('/') + 1));

}