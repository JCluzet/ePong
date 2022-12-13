#  |  |  ___ \    \  |         |
#  |  |     ) |  |\/ |   _  |  |  /   _ 
# ___ __|  __/   |   |  (   |    <    __/ 
#    _|  _____| _|  _| \__,_| _|\_\ \___|
#                              by jcluzet
################################################################################
#                                     CONFIG                                   #
################################################################################

# NAME        := transcendance
 
################################################################################
#                                 PROGRAM'S SRCS                               #
################################################################################


################################################################################
#                                  Makefile  objs                              #
################################################################################


CLR_RMV		:= \033[0m
RED		    := \033[1;31m
GREEN		:= \033[1;32m
YELLOW		:= \033[1;33m
BLUE		:= \033[1;34m
CYAN 		:= \033[1;36m
RM		    := rm -f

all:		
		@echo "$(YELLOW)command: $(CLR_RMV)"
		@echo "	$(CYAN)make a$(CLR_RMV): $(GREEN)start container attach in terminal$(CLR_RMV)"
		@echo "	$(CYAN)make d$(CLR_RMV): $(GREEN)start container detach in terminal$(CLR_RMV)"
		@echo "	$(CYAN)make clean$(CLR_RMV): $(GREEN)down container$(CLR_RMV)"
		@echo "	$(CYAN)make fclean$(CLR_RMV): $(GREEN)down container and purge docker$(CLR_RMV)"
		@echo "	$(CYAN)make re$(CLR_RMV): $(GREEN)make fclean + make a$(CLR_RMV)"
a:
			@docker compose up --build

d:
			@docker compose up --build -d

clean:
			@docker compose down -v --rmi all --remove-orphans

fclean:		clean
			@docker system prune --volumes --all --force
			@docker network prune --force
			@docker image prune --force

re:			fclean a

.PHONY:		all clean fclean re


