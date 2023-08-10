export PGPASSWORD=postgres
dirname ${0} | awk '{print "psql -h localhost -U postgres -d postgres -f" $0 "/init.sql"}' | bash
dirname ${0} | awk '{print "psql -h localhost -U postgres -d postgres -f" $0 "/insert_test_data.sql"}' | bash