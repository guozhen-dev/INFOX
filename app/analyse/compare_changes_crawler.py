import os
from selenium import webdriver
import requests


def compare(project_full_name):
    """Compare the fork with the main branch.
    Args:
        project_full_name: for example: 'NeilBetham/Smoothieware'
    Return:
        A dict contains this :
        compare_result {
            changed_file_number,
            total_changed_line_number,
            file_list {
                file_full_name,
                file_suffix,
                diff_link,
                changed_line,
                changed_code
            }
    """

    print("start : %s" % project_full_name)
    url = 'https://github.com/%s/compare' % project_full_name

    driver = webdriver.PhantomJS(
        service_args=['--ignore-ssl-errors=true', '--ssl-protocol=tlsv1'])
    # driver = webdriver.PhantomJS()
    try:
        # It will jump to https://github.com/author/repo/compare/version...author:repo
        driver.get(url)
        # driver.save_screenshot('screen.png')
        # with open('1.html','w') as f:
        #     f.write(driver.page_source)
    except:
        print("error on get diff for %s!" % project_full_name)
        return {"changed_line": -1,
                "changed_file_number": -1,
                "file_list": []}

    # current_url = requests.get(url).url

    try:
        # print (driver.current_url)
        repo_content = driver.find_element_by_class_name("repository-content")
    except:
        print("The compare result is empty.")

    try:
        # If the changed is too large, the result from github will not show diff code first.
        # Example: https://github.com/Smoothieware/Smoothieware/compare/edge...briand:edge
        repo_overall_info = repo_content.find_element_by_class_name("tabnav")
        commits, changed_files, comments = repo_overall_info.find_elements_by_class_name(
            'Counter')
        changed_file_number = int(changed_files.text)
        return {"changed_line": -1,
                "changed_file_number": changed_file_number,
                "file_list": []}
        # repo_content = driver.find_element_by_class_name('repository-content')
    except:
        pass

    file_list = []
    total_changed_line_of_source_code = -1
    try:
        diff_list = repo_content.find_element_by_id(
            "diff").find_element_by_id("files")
    except:
        return {"changed_line": 0,
                "changed_file_number": 0,
                "file_list": []}

    changed_file_number = 0
    total_changed_line_of_source_code = 0
    diff_num = 0
    # TODO(Luyao Ren) change to get the list of diff.
    # TODO(Luyao Ren) change analysis part using Beautiful Soup to speed up.
    while True:
        try:
            diff = diff_list.find_element_by_id('diff-' + str(diff_num))
            diff_num += 1
        except:
            try:
                # Some page is loading dynamic, so we need to get more diff.
                # Example: https://github.com/Smoothieware/Smoothieware/compare/edge...Nutz95:edge
                load_url = diff_list.find_element_by_tag_name(
                    'include-fragment').get_attribute('src')
                print(load_url)
                driver.get('https://github.com/' + load_url)
                diff_list = driver.find_element_by_tag_name('body')
                continue
            except:
                break
        try:
            diff_info = diff.find_element_by_class_name('file-info')
            diff_link = diff_info.find_element_by_tag_name(
                'a').get_attribute('href')
            changed_line = diff_info.text.split(
                ' ')[0].strip().replace(',', '')
            file_full_name = diff_info.text.split(' ')[1].strip()
            print((diff_num, changed_line, file_full_name))
            file_name, file_suffix = os.path.splitext(file_full_name)
            changed_code = diff.text
        except:
            print("error on parsing %s: diff%d" %
                  (project_full_name, diff_num))
            break

        try:
            total_changed_line_of_source_code += int(changed_line)
            changed_file_number += 1
        except:
            changed_line = 0
            pass

        try:
            # This is for the case that "Large diffs are not rendered by default" on Github
            # Example: https://github.com/MarlinFirmware/Marlin/compare/1.1.x...SkyNet3D:SkyNet3D-Devel
            # print('try load %s' % file_full_name)
            load_container = diff.find_element_by_class_name(
                'js-diff-load-container')
            print("This file: %s need load code." % file_full_name)
            load_url = load_container.find_element_by_xpath('//include-fragment[1]') \
                .get_attribute('data-fragment-url')
            try:
                print('https://github.com%s' % load_url)
                changed_code = requests.get(
                    'https://github.com' + load_url).text
            except:
                print("Error on get load code!")
        except:
            pass
        file_list.append({"file_full_name": file_full_name, "file_suffix": file_suffix,
                          "diff_link": diff_link, "changed_line": changed_line, "changed_code": changed_code})

    # print "changed file list:", changed_file_list
    # print("total changed line = %d" % total_changed_line_of_source_code)
    return {"changed_line": total_changed_line_of_source_code,
            "changed_file_number": changed_file_number,
            "file_list": file_list}


"""
if __name__ == '__main__':
    compare('Nutz95/Smoothieware')
    # compare('mkosieradzki/protobuf')
    # compare('SkyNet3D/Marlin')
"""