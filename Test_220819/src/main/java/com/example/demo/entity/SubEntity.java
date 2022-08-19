package com.example.demo.entity;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name= "sub_table")
public class SubEntity {


@Id @Column(name="sub1", nullable =false) private String sub1;
	@Column(name="sub2") private String sub2;
	@Column(name="sub3") private String sub3;
	@Column(name="sub4") private String sub4;

	
	
	


}
