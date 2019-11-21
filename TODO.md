Fix:

    Hyperlinks not working appropriately in Components, Modules, Shopping List. We enter the links, but when we click them it doesn’t direct appropriately.
        JRK: This will probably take 4 hrs to resolve and test.
    Shopping List - Not sorting correctly by name. If I sort the arrow (e.g. Order qty) multiple times in the same direction it is still resorting by something.
        JRK: This will probably take 2 hr to resolve.
    Extra slots to add customized item videos. Module Editor > Resources > There are only 2 slots for customized items, can you add 2 more for a total of 4.
        JRK: This will probably take 2 hr.
    Components > Component Library > Search for Container, 1.25 cup > Delete > ERROR - Can you fix this?
        JRK: This will probably take a few hours. The error will need to be investigated.
    When I was checking the links from a specific module page they didn't work, but when I went back to the components page the link worked fine. Also when I attempted to follow links in the module page they gave this style address http://scisciapp.herokuapp.com/www.amazonetc..., so maybe something has gone wrong in how the page calls up a new link? If you cut off the beginning part it works fine, and, as I said the link is working normally from the components list, just not when it's in a specific module. I was able to replicate the issue on multiple modules, so it's not just an issue with a specific module page. I let Renee know about the issue, and she suggested that you might have a coder friend who might be willing to take a stab at odd issues?
        JRK: This will take 4 hrs to run through the whole site and find the issues.


 
Enhancements:

    Build out reporting section. We’d first need to assess needs.
        JRK: This requires building requirements and likely a call to identify pain points. (Estimate: Multiple Days)
    It is possible to make the address for the app go to something like http://app.sciencefromscientists.org, or whatever you want instead of "app," rather easily from within Heroku. Instructions here: https://devcenter.heroku.com/articles/custom-domains
        JRK: Yes, I would need access to your DNS provider or a representative from your org with the credentials to coordinate the charge. (Estimate: 1 hr)
    Andrew from Prime Digital has agreed to do quarterly backups for us, but potentially we could ask Akamai to help automate this.
        JRK: I'm unaware of Akamai's relationship with your organization but could help architect this solution.  (Estimate: Multiple Days)
    Security- Per Andrew, site is, in fact, insecure. To secure it you would have to pay $7/mo. However, as long as there is no private date, he does not feel it’s necessary to have it secured. Does Akamai agree?
        JRK: It is "insecure" since there is no redirect to the httpS endpoint. Visiting: "https://scisciapp.herokuapp.com" results in an encrypted connection. Having a custom DNS name would conflict with this and force the need to pay $7/mo though. We would need to discuss this.
