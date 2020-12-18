require 'json'

package = JSON.parse(File.read(File.join(__dir__, './package.json')))

Pod::Spec.new do |s|
  s.name                = 'react-native-gcanvas'
  s.version             = package['version']
  s.summary             = "GCanvas React-Native Source."
  s.description         = package['description']
  s.homepage            = package['homepage']
  s.license             = package['license']
  s.author              = 'GCanvas Open Source Team'
  s.source              = { :git => 'https://github.com/flyskywhy/react-native-gcanvas.git', :tag => 'v'+s.version.to_s }

  s.ios.deployment_target = '9.0'
  s.tvos.deployment_target = '9.0'

  s.dependency 'React'
  s.dependency 'GCanvas'

  s.preserve_paths      = 'README.md', 'LICENSE', 'package.json'
  s.source_files = 'ios/RCT*.{h,m}',

  s.exclude_files       = 'android/**/*'
end
