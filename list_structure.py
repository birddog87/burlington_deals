import os

def print_tree(startpath, exclude_dirs):
    for root, dirs, files in os.walk(startpath, topdown=True):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]  # Exclude unwanted folders
        level = root.replace(startpath, "").count(os.sep)
        indent = " " * 4 * level
        print(f"{indent}{os.path.basename(root)}/")
        subindent = " " * 4 * (level + 1)
        for f in files:
            print(f"{subindent}{f}")

exclude_dirs = ["node_modules", ".git", "dist", "build", ".cache"]

# Fixing path issue
project_path = r"C:\Users\blend\Local Sites\burlington-deals"  # Use raw string or double backslashes

# Check if the directory exists
if not os.path.exists(project_path):
    print("Error: Directory does not exist!")
else:
    print_tree(project_path, exclude_dirs)
