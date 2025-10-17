// Listen for tab group creation and immediately ungroup tabs
chrome.tabGroups.onCreated.addListener(async (group) => {
  console.log('Tab group created, ungrouping tabs...');
  
  try {
    // Get all tabs in the newly created group
    const tabs = await chrome.tabs.query({ groupId: group.id });
    
    // Ungroup each tab
    for (const tab of tabs) {
      await chrome.tabs.ungroup(tab.id);
    }
    
    console.log('Tabs ungrouped successfully');
  } catch (error) {
    console.error('Error ungrouping tabs:', error);
  }
});

// Listen for tabs being added to groups and ungroup them
chrome.tabGroups.onUpdated.addListener(async (group) => {
  console.log('Tab group updated, checking for new tabs...');
  
  try {
    const tabs = await chrome.tabs.query({ groupId: group.id });
    
    if (tabs.length > 0) {
      for (const tab of tabs) {
        await chrome.tabs.ungroup(tab.id);
      }
      console.log('Tabs ungrouped from updated group');
    }
  } catch (error) {
    console.error('Error ungrouping tabs:', error);
  }
});

// Periodically check for any grouped tabs and ungroup them
setInterval(async () => {
  try {
    const allTabs = await chrome.tabs.query({});
    
    for (const tab of allTabs) {
      if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
        await chrome.tabs.ungroup(tab.id);
        console.log('Ungrouped tab:', tab.id);
      }
    }
  } catch (error) {
    console.error('Error in periodic check:', error);
  }
}, 1000); // Check every second

console.log('Tab Group Blocker extension loaded');