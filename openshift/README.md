# Generating Build Configs
```
oc new-build registry.access.redhat.com/rhscl/python-36-rhel7:1~https://github.com/bcgov/GDX-Analytics-Snowplow-Gateway-Service.git --strategy=source --dry-run -o yaml '--name=${NAME}${SUFFIX}' '--context-dir=${GIT_DIR'

```

# Generating Deployment Config
```
oc new-app registry.access.redhat.com/rhscl/python-36-rhel7:1 --dry-run -o yaml '--name=${NAME}${SUFFIX}'
```

# IP Ranges

Hostnames on the ***.pathfinder.gov.bc.ca:80/443 - (142.34.208.209)*** are internet accessible application routes; there is an Entrust wildcard SSL cert on this route. To contain the applicationn to BC Government traffic, we specify a whitelist range on the route. More detail in the BC Gov Pathfinder OpenShift GitBook chapter on *[Networking](https://pathfinder-faq-ocio-pathfinder-prod.pathfinder.gov.bc.ca/OCP/Networking.html)*.

| Range Name               | IPs                                                                                                                                                                                                               |   |   |   |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---|---|---|
| ***Private Network IP Range*** | 172.51.0.0/16                                                                                                                                                                                                     |   |   |   |
| ***PROD VLAN CIDR Range***     | 142.34.143.128/26; Netmask 255.255.255.192; Wildcard Bits 0.0.0.63; First IP 142.34.143.128; Last IP 142.34.143.191                                                                                                                                                                                                 |   |   |   |
| ***BCGov IP 142 Subnets***     | 142.22.0.0/16 142.23.0.0/16 142.24.0.0/16 142.25.0.0/16 142.26.0.0/16 142.27.0.0/16 142.28.0.0/16 142.29.0.0/16 142.30.0.0/16 142.31.0.0/16 142.32.0.0/16 142.33.0.0/16 142.34.0.0/16 142.35.0.0/16 142.36.0.0/16 |   |   |   |
