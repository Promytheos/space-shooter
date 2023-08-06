#### INITIALISATION ####

package_json="./package.json";
if [ -f $package_json ]
then
  echo "package.json found";
else
  echo "No package.json found. Initialisation is required";
fi

read -p "Proceed with initialisation? [y/n] " can_init;

if [ $can_init = "y" ]
then
  echo "Initialising...";
  npm init;
else
  echo "Initialisation skipped.";
fi

#### INSTALLATION ####

if [ $# -eq 0 ];
then
  echo "No packages provided.";
  read -p "Please list your packages below, space separated: " packages
else
  input_num=1;
  for input in "$@"
  do
      input_num=$((input_num + 1));
      packages+="$input "
  done
fi

echo "The following packages will be installed: $packages";
read -p "Proceed with installation? [y/n] " can_install;

if [ $can_install = "y" ]
then
  if [ ! -f $package_json ]
  then
    echo "Please note: An existing package.json could not be found. One will be generated with your packages, but npm init is recommended".
  fi
  echo "Installing...";
  npm install $packages;
else
  echo "Installation skipped.";
fi

echo "Complete."